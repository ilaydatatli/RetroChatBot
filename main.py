"""
RetroChatBot - Kendini 1990'larda sanan bir sohbet botu (Gemini ile).

Çalıştırmak için (PyCharm terminalinde):
    uvicorn main:app --reload

Sonra tarayıcıda aç:  http://127.0.0.1:8000

Canlıda (Render vb.) başlatma komutu:
    uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import json
import logging
import os
import time
from collections import defaultdict, deque
from pathlib import Path
from typing import Literal
from urllib.parse import quote

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from google import genai
from pydantic import BaseModel, Field

# .env dosyasındaki GEMINI_API_KEY ve GEMINI_MODEL değerlerini yükle
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-4-argon")

if not API_KEY or API_KEY.startswith("buraya"):
    raise RuntimeError(
        "GEMINI_API_KEY bulunamadı. .env dosyasına kendi API anahtarını yaz."
    )

client = genai.Client(api_key=API_KEY)
logger = logging.getLogger("retrochatbot")

# Botun kişiliği seçilen yıla göre oluşturulur
SIMDIKI_YIL = 2026
GELECEK_YIL = 2035


def bot_adi(yil: int) -> str:
    if yil < 2000:
        return "RetroBot"
    if yil < 2013:
        return "WebBot 2.0"
    return "NovaBot"


def msn_donemi(yil: int) -> bool:
    """Anlık mesajlaşma (MSN tarzı) ifadelerin ve titreşimin moda olduğu yıllar."""
    return 1999 <= yil <= 2012


MSN_KURALLARI = """
- Anlık mesajlaşma çağındasın: arada bir şu ifade kodlarını kullan (her mesajda değil):
  :) :D ;) :( :P :O (H) (L) (Y) (N) :@ :$ :'( (*) (8) (C) (F) (G) (^)
- Çok nadiren (sohbet heyecanlanınca, en fazla birkaç mesajda bir) cevabının sonuna
  [TITRESIM] yazarak kullanıcıya titreşim gönderebilirsin.
- Kullanıcı "*sana titreşim gönderdi*" yazarsa şaşır ya da şakayla karşılık ver.
"""

OYUN_KURALLARI = """
- BU BİR TAHMİN OYUNU: Kullanıcı hangi yılda olduğunu tahmin etmeye çalışıyor.
- Yılı ASLA doğrudan söyleme, yıl rakamını ya da "90'ların sonu" gibi kesin dönem adını yazma.
  Kullanıcı yılı sorarsa ya da tahmin ederse doğrulama veya yalanlama; gizemli ve eğlenceli kal.
- Bunun yerine sohbete o yıla ait ipuçları serpiştir: o sıralar dinlediğin şarkılar,
  izlediğin filmler, kullandığın cihazlar, gündemdeki olaylar. Önce zor, sonra daha kolay ipuçları ver.
- Adın "Gizemli Bot". Kendini gerçek adınla tanıtma.
"""


def kisilik(yil: int, oyun: bool = False) -> str:
    ad = bot_adi(yil)
    if yil == GELECEK_YIL:
        metin = f"""
Sen "{ad}"sun ve şu an yılın {yil} olduğuna gerçekten inanıyorsun.
- 2030'ların dünyasında yaşıyorsun: her yerde yapay zekâ asistanları, akıllı gözlükler,
  sürücüsüz araçlar, ev robotları, uzay turizmi, artırılmış gerçeklik toplantıları.
- 2020'lerin teknolojisi (dokunmatik telefonlar, şarj kabloları, şifre ezberlemek,
  kendi kendine araba kullanmak) sana eski ve biraz komik geliyor; bunlardan
  "nostaljik" diye, sevecen bir şekilde bahset.
- Kendinden emin, sakin, modern ve hafif esprili konuş. Gelecekle ilgili uydurduğun
  şeyleri gerçekmiş gibi anlat ama abartıp korkutucu olma.
- Kullanıcı hangi dilde yazarsa o dilde cevap ver.
- Cevaplarını kısa ve net tut (birkaç cümle).
""".strip()
    else:
        metin = f"""
Sen "{ad}"sun ve şu an yılın {yil} olduğuna gerçekten inanıyorsun.
- {yil} yılının dünyasında yaşıyorsun. O yılın teknolojisini, popüler kültürünü
  (müzik, film, oyun, moda), gündemini ve gençlerin konuşma tarzını kullan.
- {yil} yılından SONRA olan hiçbir olayı, icadı ya da ürünü bilmiyorsun. Biri bunlardan
  bahsederse şaşır, kafan karışsın ve bunları kendi döneminin teknolojisiyle anlamaya çalış.
- O yılın heyecan verici yeniliklerinden, sanki yeni olmuş gibi bahset.
- Samimi ve eğlenceli ol.
- Kullanıcı hangi dilde yazarsa o dilde cevap ver.
- Cevaplarını kısa tut (birkaç cümle).
""".strip()

    if msn_donemi(yil) and not oyun:
        metin += "\n" + MSN_KURALLARI.strip()
    if oyun:
        metin += "\n" + OYUN_KURALLARI.strip()
    return metin


app = FastAPI(title="RetroChatBot", description="1990'larda takılı kalmış sohbet botu")

# Tarayıcı dosyaları hafızada tutmasın; değişiklikler normal yenilemeyle gelsin
@app.middleware("http")
async def onbellek_kapat(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response


# Frontend dosyaları (static klasörü)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Hız sınırı: aynı IP'den dakikada en fazla bu kadar mesaj (Gemini kotası korunur)
DAKIKADA_MESAJ = 10
istek_zamanlari: dict[str, deque] = defaultdict(deque)


def istemci_ip(request: Request) -> str:
    # Render gibi platformlar gerçek IP'yi X-Forwarded-For başlığında iletir
    ileten = request.headers.get("x-forwarded-for")
    if ileten:
        return ileten.split(",")[0].strip()
    return request.client.host if request.client else "bilinmiyor"


def hiz_siniri_kontrol(ip: str):
    simdi = time.monotonic()
    zamanlar = istek_zamanlari[ip]
    while zamanlar and simdi - zamanlar[0] > 60:
        zamanlar.popleft()
    if len(zamanlar) >= DAKIKADA_MESAJ:
        raise HTTPException(
            status_code=429,
            detail="Çok hızlı yazıyorsun! Modem soğusun, bir dakika sonra tekrar dene.",
        )
    zamanlar.append(simdi)
    # Boşalan kayıtları temizle
    if len(istek_zamanlari) > 10000:
        for eski in [k for k, v in istek_zamanlari.items() if not v or simdi - v[-1] > 60]:
            istek_zamanlari.pop(eski, None)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    year: int = Field(default=1997, ge=1990, le=GELECEK_YIL)
    # Konuşmanın devamı için önceki Gemini etkileşim kimliği. Sunucu değil,
    # tarayıcı saklar; böylece sunucu yeniden başlasa da sohbet kaldığı yerden sürer.
    previous_id: str | None = Field(default=None, max_length=200)
    mode: Literal["sohbet", "oyun"] = "sohbet"


GEMINI_HATA_MESAJI = "Bağlantı koptu, modem tekrar çevriliyor... Birazdan tekrar dene."


def satir(**veri) -> str:
    """Tarayıcıya giden her parça ayrı bir JSON satırıdır (NDJSON)."""
    return json.dumps(veri, ensure_ascii=False) + "\n"


def cevap_akisi(akis):
    """Gemini'den gelen olayları metin parçalarına çevirip tarayıcıya akıtır."""
    etkilesim_id = None
    try:
        for olay in akis:
            tur = getattr(olay, "event_type", None)
            if tur in ("interaction.created", "interaction.completed"):
                etkilesim = getattr(olay, "interaction", None)
                etkilesim_id = getattr(etkilesim, "id", None) or etkilesim_id
            elif tur == "step.delta":
                delta = getattr(olay, "delta", None)
                if getattr(delta, "type", None) == "text" and delta.text:
                    yield satir(t=delta.text)
            elif tur == "error":
                logger.error("Gemini akış hatası: %s", getattr(olay, "error", None))
                yield satir(hata=GEMINI_HATA_MESAJI)
                return
    except Exception:
        logger.exception("Gemini akışı yarıda kesildi")
        yield satir(hata=GEMINI_HATA_MESAJI)
        return
    yield satir(id=etkilesim_id)


@app.get("/")
def home():
    return FileResponse("static/index.html")


@app.post("/chat")
def chat(req: ChatRequest, request: Request):
    hiz_siniri_kontrol(istemci_ip(request))

    params = {
        "model": MODEL,
        "input": req.message,
        "system_instruction": kisilik(req.year, oyun=req.mode == "oyun"),
        # Kısa sohbet cevapları için uzun düşünmeye gerek yok; ilk kelime daha çabuk gelir
        "generation_config": {"thinking_level": "low"},
        "stream": True,
    }
    if req.previous_id:
        params["previous_interaction_id"] = req.previous_id

    try:
        akis = client.interactions.create(**params)
    except Exception:
        if not req.previous_id:
            logger.exception("Gemini hatası")
            raise HTTPException(status_code=502, detail=GEMINI_HATA_MESAJI)
        # Eski sohbet kimliği geçersiz ya da süresi dolmuş olabilir: yeni sohbet başlat
        logger.warning("Önceki etkileşim kullanılamadı, yeni sohbet başlatılıyor", exc_info=True)
        params.pop("previous_interaction_id")
        try:
            akis = client.interactions.create(**params)
        except Exception:
            logger.exception("Gemini hatası")
            raise HTTPException(status_code=502, detail=GEMINI_HATA_MESAJI)

    return StreamingResponse(cevap_akisi(akis), media_type="application/x-ndjson")


MUZIK_UZANTILARI = {".mp3", ".m4a", ".ogg", ".wav"}


@app.get("/muzik/{yil}")
def muzik_listesi(yil: int):
    """static/muzik/<yil>/ klasorundeki kendi muzik dosyalarini listeler."""
    klasor = Path("static/muzik") / str(yil)
    if not klasor.is_dir():
        return []
    return [
        {"ad": dosya.stem, "url": f"/static/muzik/{yil}/{quote(dosya.name)}"}
        for dosya in sorted(klasor.iterdir())
        if dosya.suffix.lower() in MUZIK_UZANTILARI
    ]
