# 📼 RetroChatBot

Kendini hâlâ seçtiğin yılda yaşadığını sanan bir sohbet botu. 1997'ye git, modem sesiyle bağlan, RetroBot'la çevirmeli internetten bahset; 2005'e geç, MSN tarzı ifadeler ve titreşimlerle WebBot 2.0'la yazış; ya da 2035'e ışınlanıp NovaBot'un geleceğe dair anlattıklarını dinle.

**🔗 Canlı demo:** https://retrochatbot-8dfe.onrender.com

> İlk açılış 1 dakika kadar sürebilir: ücretsiz sunucu bir süre kullanılmayınca uykuya geçiyor.

<!-- Buraya ekran görüntüsü ekle: ![RetroChatBot](ekran-goruntusu.png) -->

## ✨ Özellikler

- **Zaman makinesi:** 1990–2035 arasında yıl seç; botun adı, kişiliği, konuşma tarzı ve sayfanın teması o yıla göre değişir.
- **Akan cevaplar:** Cevaplar Gemini'den parça parça gelir ve ekrana daktilo gibi yazılır.
- **Sohbet hafızası:** Bot konuşmanın önceki kısmını hatırlar; sayfa yenilense de sohbet tarayıcıda saklanır.
- **MSN dönemi (1999–2012):** `:)` `(H)` `(L)` gibi ifade kodları emojiye dönüşür, titreşim (nudge) gönderip alabilirsin.
- **🎲 Hangi yıldayım?** Gizemli Bot gizli bir yılda yaşar; onunla sohbet ederek ipuçlarını topla ve yılı tahmin et.
- **Yılın bilgileri:** O yıl neler olduğu, çıkan yenilikler, ödül alan film ve diziler.
- **Oyun köşesi:** Yılan ve Zıpzıp, özgün melodileriyle.
- **Retro sesler:** Modem, mesaj ve titreşim sesleri dosya kullanılmadan, Web Audio API ile tarayıcıda üretilir.

## 🛠️ Kullanılan teknolojiler

| Katman | Teknoloji |
|---|---|
| Backend | Python, FastAPI, Uvicorn |
| Yapay zekâ | Google Gemini (google-genai, akışlı Interactions API) |
| Frontend | HTML, CSS, saf JavaScript (framework yok) |
| Test | pytest, GitHub Actions |
| Yayın | Render |

Ayrıca: IP başına hız sınırı (dakikada 10 mesaj), girdi doğrulama ve Gemini hatalarında kullanıcıya dönemine uygun hata mesajları.

## 🚀 Kendi bilgisayarında çalıştırma

```bash
git clone https://github.com/ilaydatatli/RetroChatBot.git
cd RetroChatBot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Proje klasöründe bir `.env` dosyası oluştur:

```
GEMINI_API_KEY=senin_anahtarin
GEMINI_MODEL=gemini-4-argon
```

Sonra başlat ve tarayıcıda http://127.0.0.1:8000 adresini aç:

```bash
uvicorn main:app --reload
```

## 🧪 Testler

Testler gerçek Gemini yerine sahte bir istemci kullanır, API anahtarı gerektirmez. Her push'ta GitHub Actions'ta otomatik çalışır.

```bash
pip install -r requirements-dev.txt
pytest
```

## 📁 Proje yapısı

```
main.py            FastAPI uygulaması, botun kişiliği, /chat akışı
static/            Sayfa, stiller ve JavaScript dosyaları
tests/             Otomatik testler
Procfile           Yayın için başlatma komutu
```
