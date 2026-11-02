// "Yillari karsilastir": ayni soru iki farkli yildaki bota sorulur, cevaplar yan yana akar.
// Sohbet gecmisine yazilmaz; her soru iki bot icin de yeni bir sohbettir.

(function () {
  const pencere = document.getElementById("karsilastir");
  const acDugmesi = document.getElementById("karsilastir-ac");
  const kapatDugmesi = document.getElementById("karsilastir-kapat");
  const form = document.getElementById("karsilastir-form");
  const soruKutusu = document.getElementById("karsilastir-soru");
  const sorDugmesi = document.getElementById("karsilastir-sor");
  const yilSecicileri = [document.getElementById("karsilastir-yil-1"), document.getElementById("karsilastir-yil-2")];
  const sutunlar = [document.getElementById("karsilastir-sutun-1"), document.getElementById("karsilastir-sutun-2")];
  let soruluyor = false;

  // Zaman makinesindeki yillarin aynisi
  yilSecicileri.forEach((secici) => {
    for (const secenek of yilSecici.options) secici.appendChild(new Option(secenek.textContent, secenek.value));
  });
  yilSecicileri[0].value = "1997";
  yilSecicileri[1].value = String(GELECEK_YIL);

  function sutunuHazirla(sira) {
    const yil = parseInt(yilSecicileri[sira].value, 10);
    const d = donemBilgisi(yil);
    const sutun = sutunlar[sira];
    sutun.dataset.tema = d.tema;
    sutun.querySelector("h3").textContent = d.botAdi + " · " + yil;
    return { yil, sutun, cevapKutusu: sutun.querySelector(".karsilastir-cevap") };
  }

  function sutunlariHazirla() {
    [0, 1].forEach(sutunuHazirla);
  }

  // Bir botun cevabini akitir; metin geldikce daktilo gibi yazilir
  async function botaSor({ yil, cevapKutusu }, soru) {
    cevapKutusu.classList.remove("hata");
    cevapKutusu.classList.add("bekliyor");
    cevapKutusu.textContent = donemBilgisi(yil).yaziyor;
    let metin = "";
    let gosterilen = 0;
    let akisBitti = false;
    const daktilo = new Promise((bitti) => {
      const adim = () => {
        if (gosterilen < metin.length) {
          if (gosterilen === 0) cevapKutusu.classList.remove("bekliyor");
          gosterilen = Math.min(metin.length, gosterilen + Math.max(2, Math.ceil((metin.length - gosterilen) / 40)));
          ifadeliYaz(cevapKutusu, botMetniTemizle(metin.slice(0, gosterilen)));
        }
        if (akisBitti && gosterilen >= metin.length) bitti();
        else setTimeout(adim, 30);
      };
      adim();
    });

    const hataGoster = (yazi) => {
      cevapKutusu.classList.remove("bekliyor");
      cevapKutusu.classList.add("hata");
      cevapKutusu.textContent = yazi;
    };

    try {
      const cevap = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: soru, year: yil }),
      });
      if (!cevap.ok) {
        const veri = await cevap.json().catch(() => ({}));
        akisBitti = true;
        await daktilo;
        hataGoster(typeof veri.detail === "string" ? veri.detail : "Bir seyler ters gitti.");
        return false;
      }
      let sonuc;
      try {
        sonuc = await cevabiOku(cevap, (parca) => { metin += parca; });
      } finally {
        akisBitti = true;
      }
      await daktilo;
      if (sonuc.hata && !metin) {
        hataGoster(sonuc.hata);
        return false;
      }
      return true;
    } catch (hata) {
      akisBitti = true;
      await daktilo;
      hataGoster("Sunucuya ulasilamadi. Telefon hatti mesgul olabilir!");
      return false;
    }
  }

  async function karsilastir(soru) {
    if (soruluyor) return;
    soruluyor = true;
    sorDugmesi.disabled = true;
    yilSecicileri.forEach((secici) => { secici.disabled = true; });
    const hazirlar = [sutunuHazirla(0), sutunuHazirla(1)];
    const sonuclar = await Promise.all(hazirlar.map((h) => botaSor(h, soru)));
    if (sonuclar.some(Boolean)) RetroSes.mesaj(hazirlar[1].sutun.dataset.tema);
    soruluyor = false;
    sorDugmesi.disabled = false;
    yilSecicileri.forEach((secici) => { secici.disabled = false; });
  }

  form.addEventListener("submit", (olay) => {
    olay.preventDefault();
    const soru = soruKutusu.value.trim();
    if (soru) karsilastir(soru);
  });

  pencere.querySelectorAll(".karsilastir-oneriler button").forEach((dugme) => {
    dugme.addEventListener("click", () => {
      soruKutusu.value = dugme.textContent;
      karsilastir(dugme.textContent);
    });
  });

  // Yil degisince eski cevap yeni botun altinda kalmasin
  yilSecicileri.forEach((secici, sira) => secici.addEventListener("change", () => {
    const { cevapKutusu } = sutunuHazirla(sira);
    cevapKutusu.className = "karsilastir-cevap";
    cevapKutusu.textContent = "";
  }));

  acDugmesi.addEventListener("click", () => {
    sutunlariHazirla();
    pencere.showModal();
    soruKutusu.focus();
  });
  kapatDugmesi.addEventListener("click", () => pencere.close());
  // Pencerenin disina (karartilmis alana) tiklayinca kapanir
  pencere.addEventListener("click", (olay) => {
    if (olay.target !== pencere) return;
    const k = pencere.getBoundingClientRect();
    const disarida = olay.clientX < k.left || olay.clientX > k.right || olay.clientY < k.top || olay.clientY > k.bottom;
    if (disarida) pencere.close();
  });
})();
