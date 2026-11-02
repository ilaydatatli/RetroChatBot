import json

import pytest

import main
from conftest import metin_parcasi, olay


def satirlari_oku(cevap):
    return [json.loads(s) for s in cevap.text.splitlines() if s.strip()]


def mesaj_gonder(istemci, **alanlar):
    govde = {"message": "selam", "year": 2005, **alanlar}
    return istemci.post("/chat", json=govde)


# --- Botun kişiliği ---


@pytest.mark.parametrize(
    "yil, ad",
    [(1990, "RetroBot"), (1999, "RetroBot"), (2000, "WebBot 2.0"), (2012, "WebBot 2.0"), (2013, "NovaBot"), (2035, "NovaBot")],
)
def test_bot_adi_yila_gore_degisir(yil, ad):
    assert main.bot_adi(yil) == ad


def test_kisilik_secilen_yili_icerir():
    assert "1997" in main.kisilik(1997)


def test_msn_kurallari_sadece_msn_yillarinda():
    assert "[TITRESIM]" in main.kisilik(2005)
    assert "[TITRESIM]" not in main.kisilik(1995)
    assert "[TITRESIM]" not in main.kisilik(2020)


def test_oyun_modunda_gizemli_bot_olur_ve_msn_kurali_eklenmez():
    metin = main.kisilik(2005, oyun=True)
    assert "Gizemli Bot" in metin
    assert "[TITRESIM]" not in metin


def test_gelecek_yili_icin_ozel_kisilik():
    assert "2030'ların" in main.kisilik(main.GELECEK_YIL)


# --- Sayfalar ---


def test_ana_sayfa_acilir(istemci):
    cevap = istemci.get("/")
    assert cevap.status_code == 200
    assert "tahmin-baslat" in cevap.text


def test_statik_dosyalar_onbelleklenmez(istemci):
    cevap = istemci.get("/static/script.js")
    assert cevap.status_code == 200
    assert cevap.headers["cache-control"] == "no-store"


def test_muzik_klasoru_olmayan_yil_bos_liste_doner(istemci):
    assert istemci.get("/muzik/1993").json() == []


# --- Sohbet ---


def test_cevap_parca_parca_akar_ve_sonda_kimlik_gelir(istemci):
    cevap = mesaj_gonder(istemci)
    assert cevap.status_code == 200
    assert cevap.headers["content-type"].startswith("application/x-ndjson")
    assert satirlari_oku(cevap) == [{"t": "Selam "}, {"t": "dostum! :)"}, {"id": "etkilesim-1"}]


def test_geminiye_dogru_ayarlar_gider(istemci, gemini):
    mesaj_gonder(istemci, message="naber", year=1997)
    params = gemini.cagrilar[0]
    assert params["input"] == "naber"
    assert params["stream"] is True
    assert params["generation_config"] == {"thinking_level": "low"}
    assert "1997" in params["system_instruction"]
    assert "previous_interaction_id" not in params


def test_onceki_kimlik_sohbetin_devami_icin_iletilir(istemci, gemini):
    mesaj_gonder(istemci, previous_id="eski-sohbet")
    assert gemini.cagrilar[0]["previous_interaction_id"] == "eski-sohbet"


def test_oyun_modu_gizemli_bot_kisiligini_kullanir(istemci, gemini):
    mesaj_gonder(istemci, mode="oyun")
    assert "Gizemli Bot" in gemini.cagrilar[0]["system_instruction"]


def test_gecersiz_onceki_kimlikte_yeni_sohbet_baslar(istemci, gemini):
    gemini.hatalar = [ValueError("süresi dolmuş etkileşim")]
    cevap = mesaj_gonder(istemci, previous_id="suresi-dolmus")
    assert cevap.status_code == 200
    assert len(gemini.cagrilar) == 2
    assert "previous_interaction_id" not in gemini.cagrilar[1]
    assert satirlari_oku(cevap)[-1] == {"id": "etkilesim-1"}


def test_gemini_ulasilamazsa_502_ve_retro_mesaj(istemci, gemini):
    gemini.hatalar = [RuntimeError("ağ yok")]
    cevap = mesaj_gonder(istemci)
    assert cevap.status_code == 502
    assert cevap.json()["detail"] == main.GEMINI_HATA_MESAJI


def test_akis_sirasinda_hata_gelirse_kullaniciya_bildirilir(istemci, gemini):
    gemini.olaylar = [metin_parcasi("Sel"), olay("error", error="kota doldu")]
    satirlar = satirlari_oku(mesaj_gonder(istemci))
    assert satirlar == [{"t": "Sel"}, {"hata": main.GEMINI_HATA_MESAJI}]


def test_akis_yarida_koparsa_kullaniciya_bildirilir(istemci, gemini):
    def kopan_akis():
        yield metin_parcasi("Sel")
        raise ConnectionError("bağlantı koptu")

    gemini.create = lambda **params: kopan_akis()
    satirlar = satirlari_oku(mesaj_gonder(istemci))
    assert satirlar == [{"t": "Sel"}, {"hata": main.GEMINI_HATA_MESAJI}]


# --- Girdi kontrolleri ---


@pytest.mark.parametrize(
    "alanlar",
    [
        {"message": ""},
        {"message": "a" * 501},
        {"year": 1989},
        {"year": main.GELECEK_YIL + 1},
        {"mode": "hile"},
        {"previous_id": "x" * 201},
    ],
)
def test_gecersiz_istekler_reddedilir(istemci, gemini, alanlar):
    assert mesaj_gonder(istemci, **alanlar).status_code == 422
    assert gemini.cagrilar == []


def test_500_karakterlik_mesaj_kabul_edilir(istemci):
    assert mesaj_gonder(istemci, message="a" * 500).status_code == 200


# --- Hız sınırı ---


def test_dakikada_10_mesajdan_sonrasi_engellenir(istemci, gemini):
    for _ in range(main.DAKIKADA_MESAJ):
        assert mesaj_gonder(istemci).status_code == 200
    cevap = mesaj_gonder(istemci)
    assert cevap.status_code == 429
    assert "Modem soğusun" in cevap.json()["detail"]
    assert len(gemini.cagrilar) == main.DAKIKADA_MESAJ


def test_hiz_siniri_her_kullaniciya_ayri_uygulanir(istemci):
    ali = {"X-Forwarded-For": "1.1.1.1"}
    ayse = {"X-Forwarded-For": "2.2.2.2, 10.0.0.1"}
    for _ in range(main.DAKIKADA_MESAJ):
        istemci.post("/chat", json={"message": "selam"}, headers=ali)
    assert istemci.post("/chat", json={"message": "selam"}, headers=ali).status_code == 429
    assert istemci.post("/chat", json={"message": "selam"}, headers=ayse).status_code == 200
