"""
Testler gerçek Gemini'ye bağlanmaz: main.client sahte bir istemciyle değiştirilir.

Çalıştırmak için (proje klasöründe):
    pip install -r requirements-dev.txt
    pytest
"""

import os
from pathlib import Path
from types import SimpleNamespace

import pytest

# main.py, static klasörünü ve .env'i proje klasörüne göre arar
os.chdir(Path(__file__).resolve().parent.parent)
# main.py anahtar olmadan açılmaz; testlerde sahte bir anahtar yeter
os.environ.setdefault("GEMINI_API_KEY", "test-anahtari")

import main  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402


def olay(tur, **alanlar):
    return SimpleNamespace(event_type=tur, **alanlar)


def metin_parcasi(yazi):
    return olay("step.delta", delta=SimpleNamespace(type="text", text=yazi))


def etkilesim(tur, kimlik):
    return olay(tur, interaction=SimpleNamespace(id=kimlik))


class SahteGemini:
    """client.interactions.create çağrılarını kaydeder ve hazır olayları döndürür."""

    def __init__(self):
        self.cagrilar = []
        self.olaylar = [
            etkilesim("interaction.created", "etkilesim-1"),
            metin_parcasi("Selam "),
            metin_parcasi("dostum! :)"),
            etkilesim("interaction.completed", "etkilesim-1"),
        ]
        # Sırayla fırlatılacak hatalar (ör. [ValueError()] ilk çağrıyı bozar)
        self.hatalar = []
        self.interactions = self

    def create(self, **params):
        self.cagrilar.append(params)
        if self.hatalar:
            raise self.hatalar.pop(0)
        return iter(self.olaylar)


@pytest.fixture
def gemini(monkeypatch):
    sahte = SahteGemini()
    monkeypatch.setattr(main, "client", sahte)
    return sahte


@pytest.fixture
def istemci(gemini):
    # Her test hız sınırı sayacını sıfırdan başlatsın
    main.istek_zamanlari.clear()
    return TestClient(main.app)
