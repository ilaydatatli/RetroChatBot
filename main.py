"""
RetroChatBot - Kendini 1990'larda sanan bir sohbet botu (Gemini ile).

Çalıştırmak için (PyCharm terminalinde):
    uvicorn main:app --reload

Sonra tarayıcıda aç:  http://127.0.0.1:8000
"""

import os
from pathlib import Path
from urllib.parse import quote

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
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

# Botun kişiliği seçilen yıla göre oluşturulur
SIMDIKI_YIL = 2026
GELECEK_YIL = 2035


def bot_adi(yil: int) -> str:
    if yil < 2000:
        return "RetroBot"
    if yil < 2013:
        return "WebBot 2.0"
    return "NovaBot"


def kisilik(yil: int) -> str:
    ad = bot_adi(yil)
    if yil == GELECEK_YIL:
        return f"""
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

    return f"""
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


app = FastAPI(title="RetroChatBot", description="1990'larda takılı kalmış sohbet botu")

# Tarayıcı dosyaları hafızada tutmasın; değişiklikler normal yenilemeyle gelsin
@app.middleware("http")
async def onbellek_kapat(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response


# Frontend dosyaları (static klasörü)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Her oturumun son Gemini etkileşim kimliği (konuşmanın devamı için).
# Sunucu yeniden başlayınca sıfırlanır.
sessions: dict[str, str] = {}


class ChatRequest(BaseModel):
    message: str
    session_id: str = "varsayilan"
    year: int = Field(default=1997, ge=1990, le=GELECEK_YIL)


class ChatResponse(BaseModel):
    reply: str
    session_id: str


def extract_text(interaction) -> str:
    """Gemini cevabındaki metni çıkarır."""
    text = getattr(interaction, "output_text", None)
    if text:
        return text
    parts = []
    for step in getattr(interaction, "steps", None) or []:
        if getattr(step, "type", None) == "model_output":
            for item in getattr(step, "content", None) or []:
                if getattr(item, "type", None) == "text":
                    parts.append(item.text)
    return "\n".join(parts) or "...bağlantı koptu, modem tekrar çevriliyor..."


@app.get("/")
def home():
    return FileResponse("static/index.html")


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # Her yılın kendi konuşma geçmişi olsun
    key = f"{req.session_id}:{req.year}"
    params = {
        "model": MODEL,
        "input": req.message,
        "system_instruction": kisilik(req.year),
    }
    previous_id = sessions.get(key)
    if previous_id:
        params["previous_interaction_id"] = previous_id

    try:
        interaction = client.interactions.create(**params)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini hatası: {e}")

    sessions[key] = interaction.id
    return ChatResponse(reply=extract_text(interaction), session_id=req.session_id)


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


@app.delete("/chat/{session_id}")
def reset(session_id: str):
    for key in [k for k in sessions if k.startswith(session_id + ":")]:
        sessions.pop(key, None)
    return {"mesaj": f"'{session_id}' oturumu sıfırlandı."}
