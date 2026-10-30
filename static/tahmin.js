// "Hangi yildayim?" oyunu: Gizemli Bot gizli bir yilda yasar, kullanici sohbet ederek yili tahmin eder.
// Oyunun durumu (tahmin nesnesi) ve sohbet islevleri script.js'te.

(function () {
  const panel = document.getElementById("tahmin-paneli");
  const yilBilgisi = document.getElementById("yil-bilgisi");
  const baslatDugmesi = document.getElementById("tahmin-baslat");
  const tahminYil = document.getElementById("tahmin-yil");
  const tahminGonder = document.getElementById("tahmin-gonder");
  const sonucYazi = document.getElementById("tahmin-sonuc");
  const gecmisListe = document.getElementById("tahmin-gecmisi");
  const denemeYazi = document.getElementById("tahmin-deneme");
  const rekorYazi = document.getElementById("tahmin-rekor");
  const pesDugmesi = document.getElementById("tahmin-pes");
  const cikDugmesi = document.getElementById("tahmin-cik");
  const calarBolumu = document.querySelector(".calar");

  for (let y = ILK_YIL; y <= SIMDIKI_YIL; y++) tahminYil.appendChild(new Option(String(y), String(y)));
  tahminYil.value = "2000";

  function rekoruGoster() {
    const rekor = guvenliOku("retrobot_tahmin_rekor", "");
    rekorYazi.textContent = rekor ? rekor + " deneme" : "—";
  }

  function sicaklik(fark) {
    if (fark <= 2) return "🔥 Çok sıcak!";
    if (fark <= 5) return "♨️ Sıcak";
    if (fark <= 10) return "🌤️ Ilık";
    return "🧊 Soğuk";
  }

  function oyunuBaslat() {
    tahmin.aktif = true;
    tahmin.bitti = false;
    tahmin.deneme = 0;
    tahmin.yil = ILK_YIL + Math.floor(Math.random() * (SIMDIKI_YIL - ILK_YIL + 1));
    tahmin.gecmis = { id: null, satirlar: [] };

    document.body.classList.add("tahmin-oyunu");
    panel.hidden = false;
    yilBilgisi.hidden = true;
    if (calarBolumu) calarBolumu.hidden = true; // sarki listesi yili ele verir
    yilSecici.disabled = true;
    baslatDugmesi.disabled = true;
    tahminGonder.disabled = false;
    pesDugmesi.disabled = false;
    gecmisListe.innerHTML = "";
    sonucYazi.textContent = "";
    denemeYazi.textContent = "0";
    // Sayfadaki yil yazilarini gizle (oyun bitince yiliUygula geri getirir)
    pencereYazi.textContent = "❓ Gizemli Bot - Bilinmeyen yıl";
    document.title = "❓ Hangi yıldayım?";
    document.getElementById("modern-ad").textContent = "Gizemli Bot";
    document.getElementById("modern-alt-baslik").textContent = "Bilinmeyen bir yıldan sesleniyor · ????";
    document.getElementById("telif-yil").textContent = "????";
    durumSatiriniGuncelle();
    rekoruGoster();
    karsilama();
    RetroSes.modem();
    mesajKutusu.focus();
  }

  function oyunuBitir(kazandi) {
    tahmin.bitti = true;
    tahminGonder.disabled = true;
    pesDugmesi.disabled = true;
    if (kazandi) {
      sonucYazi.textContent = "🎉 Bildin! Gizemli Bot " + tahmin.yil + " yılındaydı. (" + tahmin.deneme + " deneme)";
      satirEkle("sistem", "", "*** TEBRİKLER! Yıl " + tahmin.yil + " idi. " + tahmin.deneme + " denemede bildin! ***");
      const rekor = parseInt(guvenliOku("retrobot_tahmin_rekor", "0"), 10);
      if (!rekor || tahmin.deneme < rekor) {
        guvenliYaz("retrobot_tahmin_rekor", String(tahmin.deneme));
        sonucYazi.textContent += " Yeni rekor! 🏆";
      }
      rekoruGoster();
      RetroSes.kazandin();
    } else {
      sonucYazi.textContent = "🏳️ Gizemli Bot " + tahmin.yil + " yılındaydı.";
      satirEkle("sistem", "", "*** Cevap: " + tahmin.yil + " ***");
    }
  }

  function oyundanCik() {
    tahmin.aktif = false;
    document.body.classList.remove("tahmin-oyunu");
    panel.hidden = true;
    yilBilgisi.hidden = false;
    if (calarBolumu) calarBolumu.hidden = false;
    yilSecici.disabled = false;
    baslatDugmesi.disabled = false;
    yiliUygula();
  }

  tahminGonder.addEventListener("click", () => {
    if (!tahmin.aktif || tahmin.bitti) return;
    const tahminEdilen = parseInt(tahminYil.value, 10);
    tahmin.deneme += 1;
    denemeYazi.textContent = String(tahmin.deneme);

    if (tahminEdilen === tahmin.yil) {
      oyunuBitir(true);
      return;
    }
    const fark = Math.abs(tahminEdilen - tahmin.yil);
    const yon = tahminEdilen > tahmin.yil ? "⬇️ Daha eski bir yıl" : "⬆️ Daha yeni bir yıl";
    sonucYazi.textContent = tahminEdilen + " değil! " + yon + " · " + sicaklik(fark);
    const li = document.createElement("li");
    li.textContent = tahminEdilen + " → " + sicaklik(fark);
    gecmisListe.prepend(li);
    RetroSes.yanlis();
  });

  pesDugmesi.addEventListener("click", () => {
    if (tahmin.aktif && !tahmin.bitti) oyunuBitir(false);
  });
  cikDugmesi.addEventListener("click", oyundanCik);
  baslatDugmesi.addEventListener("click", oyunuBaslat);
})();
