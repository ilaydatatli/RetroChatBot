// RetroBot zaman makinesi sohbet ekrani

const sohbet = document.getElementById("sohbet");
const form = document.getElementById("form");
const mesajKutusu = document.getElementById("mesaj");
const gonderDugmesi = document.getElementById("gonder");
const sifirlaDugmesi = document.getElementById("sifirla");
const yilSecici = document.getElementById("yil-secici");
const pencereYazi = document.getElementById("pencere-yazi");

const ILK_YIL = 1990;
const SIMDIKI_YIL = 2026;
const GELECEK_YIL = 2035;

function guvenliOku(anahtar, varsayilan) {
  try { return localStorage.getItem(anahtar) || varsayilan; } catch (e) { return varsayilan; }
}
function guvenliYaz(anahtar, deger) {
  try { localStorage.setItem(anahtar, deger); } catch (e) {}
}

// Secilen yila gore gorunum (tema), bot adi ve yazilar
function donemBilgisi(yil) {
  if (yil < 2000) {
    return {
      tema: "retro",
      botAdi: "RetroBot",
      sayfaBasligi: "~*~ RetroBot'un Ana Sayfasi ~*~",
      pencere: "💾 RetroBot Sohbet Odasi - 56k modem ile bagli",
      placeholder: "Mesajini yaz ve ENTER'a bas...",
      gonder: "Gonder",
      yaziyor: "RetroBot yaziyor...",
      karsilama: [
        ["sistem", "", "*** Modem baglaniyor... ciiiiiiiit... kssshhhhh... ***"],
        ["sistem", "", "*** Baglanti kuruldu: 56.000 bps ***"],
        ["bot", "RetroBot", "Selaaam! " + yil + " yilindan selamlar! Sohbet odama hos geldin!"],
      ],
    };
  }
  if (yil < 2013) {
    return {
      tema: "web2",
      botAdi: "WebBot 2.0",
      sayfaBasligi: "WebBot 2.0 · " + yil,
      altBaslik: "Sosyal sohbet deneyimi · " + yil,
      altBilgi: "Geniş bant bağlantı aktif · RSS'e abone ol!",
      pencere: "💬 WebBot 2.0 ile sohbet",
      placeholder: "Bir mesaj yaz...",
      gonder: "Gönder",
      yaziyor: "WebBot 2.0 yazıyor...",
      karsilama: [
        ["sistem", "", "ADSL bağlantısı kuruldu · " + yil],
        ["bot", "WebBot 2.0", "Selam! " + yil + " yılına hoş geldin. Neler yapıyorsun?"],
      ],
    };
  }
  const gelecek = yil === GELECEK_YIL;
  return {
    tema: "modern",
    botAdi: "NovaBot",
    sayfaBasligi: "NovaBot · " + yil,
    altBaslik: (gelecek ? "Kişisel yapay zekâ asistanın · " : "Yapay zekâ asistanın · ") + yil,
    altBilgi: gelecek ? "Uçtan uca şifreli · Nöral bağlantı aktif" : "Uçtan uca şifreli · Bulut bağlantısı aktif",
    pencere: gelecek ? "● Nöral bağlantı aktif" : "● Çevrimiçi",
    placeholder: "NovaBot'a bir şey sor...",
    gonder: "Gönder",
    yaziyor: "NovaBot düşünüyor…",
    karsilama: [
      ["sistem", "", "Zaman senkronizasyonu tamamlandı · " + yil],
      ["bot", "NovaBot", "Merhaba! Ben NovaBot. Bugün sana nasıl yardımcı olabilirim?"],
    ],
  };
}

// Yil secicisini doldur: 1990 - 2026 ve gelecek
for (let y = ILK_YIL; y <= SIMDIKI_YIL; y++) {
  const secenek = document.createElement("option");
  secenek.value = String(y);
  secenek.textContent = y === SIMDIKI_YIL ? y + " (bugün)" : String(y);
  yilSecici.appendChild(secenek);
}
const gelecekSecenek = document.createElement("option");
gelecekSecenek.value = String(GELECEK_YIL);
gelecekSecenek.textContent = GELECEK_YIL + " (gelecek 🚀)";
yilSecici.appendChild(gelecekSecenek);

let yil = parseInt(guvenliOku("retrobot_yil", "1997"), 10);
if (!(yil >= ILK_YIL && yil <= SIMDIKI_YIL) && yil !== GELECEK_YIL) yil = 1997;
yilSecici.value = String(yil);

// "Hangi yildayim?" oyununun durumu (oyun ekrani tahmin.js'te)
const tahmin = { aktif: false, yil: null, deneme: 0, bitti: false, gecmis: { id: null, satirlar: [] } };

// Sohbet gecmisi tarayicida, her yil icin ayri saklanir: Gemini'nin konusma kimligi
// (bot konusulanlari hatirlasin) ve ekrandaki son satirlar (sayfa yenilense de gorunsun).
const MAKS_SATIR = 60;

function gecmisiOku() {
  if (tahmin.aktif) return tahmin.gecmis;
  try {
    const veri = JSON.parse(localStorage.getItem("retrobot_gecmis_" + yil) || "null");
    if (veri && Array.isArray(veri.satirlar)) return veri;
  } catch (e) {}
  return { id: null, satirlar: [] };
}

function gecmisiYaz(gecmis) {
  gecmis.satirlar = gecmis.satirlar.slice(-MAKS_SATIR);
  if (tahmin.aktif) { tahmin.gecmis = gecmis; return; }
  guvenliYaz("retrobot_gecmis_" + yil, JSON.stringify(gecmis));
}

function gecmisiSil() {
  if (tahmin.aktif) { tahmin.gecmis = { id: null, satirlar: [] }; return; }
  try { localStorage.removeItem("retrobot_gecmis_" + yil); } catch (e) {}
}

// Su an kimle konusuyoruz? (oyunda yil gizli, bot "Gizemli Bot")
function aktifBot() {
  if (tahmin.aktif) return { yil: tahmin.yil, botAdi: "Gizemli Bot", tema: donemBilgisi(yil).tema, mod: "oyun" };
  const d = donemBilgisi(yil);
  return { yil, botAdi: d.botAdi, tema: d.tema, mod: "sohbet" };
}

function satirEkle(tur, kim, metin) {
  const p = document.createElement("p");
  p.className = "satir " + tur;
  if (kim) {
    const b = document.createElement("span");
    b.className = "kim";
    b.textContent = kim + ": ";
    p.appendChild(b);
  }
  const yazi = document.createElement("span");
  yazi.className = "yazi";
  if (tur === "bot" || tur === "kullanici") ifadeliYaz(yazi, metin);
  else yazi.textContent = metin;
  p.appendChild(yazi);
  sohbet.appendChild(p);
  sohbet.scrollTop = sohbet.scrollHeight;
  return p;
}

// Botun [TITRESIM] isaretini ve henuz tamamlanmamis "[TIT..." parcasini gizler
function botMetniTemizle(metin) {
  return metin.replace(/\[TITRESIM\]/g, "").replace(/\[[A-ZİŞ]*$/, "").trimEnd();
}

function karsilamaSatirlari() {
  if (tahmin.aktif) {
    return [
      ["sistem", "", "*** Zaman makinesi bozuldu... Bilinmeyen bir yıla ışınlandın! ***"],
      ["bot", "Gizemli Bot", "Selam yabancı! Bil bakalım hangi yıldayız? Bana bir şeyler sor, ipuçları vereyim ;)"],
    ];
  }
  return donemBilgisi(yil).karsilama;
}

function karsilama() {
  sohbet.innerHTML = "";
  karsilamaSatirlari().forEach(([tur, kim, metin]) => satirEkle(tur, kim, metin));
}

// Kayitli sohbet varsa onu, yoksa karsilama mesajlarini goster
function sohbetiYukle() {
  const gecmis = gecmisiOku();
  if (!gecmis.satirlar.length) { karsilama(); return; }
  sohbet.innerHTML = "";
  satirEkle("sistem", "", "*** Önceki sohbet geri yüklendi ***");
  gecmis.satirlar.forEach(([tur, kim, metin]) => satirEkle(tur, kim, metin));
}

// Yila gore yazi tipi
function yaziTipi(yil) {
  if (yil <= 1993) return { ad: "terminal", aciklama: "VT323 · DOS ekranı" };
  if (yil <= 1996) return { ad: "piksel", aciklama: "Pixelify Sans · piksel ekran yazısı" };
  if (yil <= 1999) return { ad: "klasik", aciklama: "Comic Sans & Times · 90'ların sonu" };
  if (yil <= 2006) return { ad: "verdana", aciklama: "Verdana & Tahoma · 2000'lerin başı" };
  if (yil <= 2012) return { ad: "trebuchet", aciklama: "Trebuchet MS · Web 2.0" };
  if (yil <= 2019) return { ad: "roboto", aciklama: "Roboto · düz tasarım dönemi" };
  if (yil <= SIMDIKI_YIL) return { ad: "inter", aciklama: "Inter · günümüz" };
  return { ad: "gelecek", aciklama: "Orbitron & Space Grotesk · gelecek" };
}

// Sol paneldeki yil bilgilerini doldur
function bolumEkle(kap, baslik, maddeler) {
  if (!maddeler.length) return;
  const h = document.createElement("h3");
  h.className = "bilgi-bolum";
  h.textContent = baslik;
  kap.appendChild(h);
  const ul = document.createElement("ul");
  ul.className = "bilgi-listesi";
  maddeler.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    ul.appendChild(li);
  });
  kap.appendChild(ul);
}

function bilgileriGoster() {
  const baslik = document.getElementById("bilgi-baslik");
  const kap = document.getElementById("bilgi-icerik");
  baslik.textContent = yil === GELECEK_YIL ? "📅 " + yil + " (hayal)" : "📅 " + yil;
  kap.innerHTML = "";

  const veri = OLAYLAR[yil] || { olaylar: [], yenilikler: [], oduller: {} };
  bolumEkle(kap, "📰 Neler oldu?", veri.olaylar || []);
  bolumEkle(kap, "💡 Yenilikler ve icatlar", veri.yenilikler || []);

  const o = veri.oduller || {};
  const odul = [];
  if (o.film) odul.push("🎬 Film: " + o.film + " (Oscar, En İyi Film)");
  if (o.dizi) odul.push("📺 Dizi: " + o.dizi + " (Emmy, En İyi Drama)");
  if (o.kitap) odul.push("📚 Kitap: " + o.kitap + " (Booker Ödülü)");
  if (o.nobel) odul.push("🖋️ Nobel Edebiyat: " + o.nobel);
  bolumEkle(kap, "🏆 Ödül alan eserler", odul);

  const arkaPlanAdi = arkaPlanUygula(yil, donemBilgisi(yil).tema);
  document.getElementById("yazi-tipi-notu").textContent =
    "🔤 Yazı tipi: " + yaziTipi(yil).aciklama + "\n🎨 Arka plan: " + arkaPlanAdi;
}

// ======================= MP3 CALAR =======================
const calarSes = document.getElementById("calar-ses");
const calarBaslik = document.getElementById("calar-baslik");
const calarListe = document.getElementById("calar-liste");
const calarOynat = document.getElementById("calar-oynat");
const calarIlerleme = document.getElementById("calar-ilerleme");
const calarSure = document.getElementById("calar-sure");
let calarParcalar = []; // { ad, url } (url varsa sayfada calar, yoksa YouTube'da aranir)
let calarSira = -1;

function sureYaz(sn) {
  if (!isFinite(sn)) sn = 0;
  const d = Math.floor(sn / 60), s = Math.floor(sn % 60);
  return String(d).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

async function calarListesiniYukle() {
  calarSes.pause();
  calarSira = -1;
  calarOynat.textContent = "▶";
  calarIlerleme.style.width = "0%";
  calarSure.textContent = "00:00";
  calarBaslik.textContent = yil + " yılının hitleri hazır. Bir şarkı seç!";
  document.getElementById("calar-yil-baslik").textContent = "💿 " + yil + " hitleri";

  const istenenYil = yil;
  let kendiDosyalarin = [];
  try {
    const cevap = await fetch("/muzik/" + yil);
    if (cevap.ok) kendiDosyalarin = await cevap.json();
  } catch (e) {}
  if (istenenYil !== yil) return; // bu arada yil degistiyse eski sonucu kullanma

  const hitler = (SARKILAR[yil] || []).slice(0, 25).map(([sanatci, sarki]) => ({ ad: sanatci + " — " + sarki }));
  calarParcalar = kendiDosyalarin.map((d) => ({ ad: "💾 " + d.ad, url: d.url })).concat(hitler);

  calarListe.innerHTML = "";
  if (!calarParcalar.length) {
    const li = document.createElement("li");
    li.className = "bos";
    li.textContent = "Bu yıl için liste yok. Kendi MP3'lerini ekleyebilirsin!";
    calarListe.appendChild(li);
  }
  calarParcalar.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = p.ad;
    li.title = p.url ? "Burada çal" : "YouTube'da aç";
    li.addEventListener("click", () => parcaCal(i));
    calarListe.appendChild(li);
  });
}

function parcaCal(i) {
  if (!calarParcalar.length) return;
  calarSira = (i + calarParcalar.length) % calarParcalar.length;
  const p = calarParcalar[calarSira];
  [...calarListe.children].forEach((li, k) => li.classList.toggle("caliyor", k === calarSira));
  calarBaslik.textContent = "♪ " + p.ad + " ♪";
  durumSatiriniGuncelle(p.ad.replace(/^💾 /, ""));
  if (p.url) {
    calarSes.src = p.url;
    calarSes.play().catch(() => {});
  } else {
    calarSes.pause();
    calarOynat.textContent = "▶";
    window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(p.ad.replace("—", "")), "_blank", "noopener");
  }
}

calarOynat.addEventListener("click", () => {
  if (calarSira < 0) { parcaCal(0); return; }
  const p = calarParcalar[calarSira];
  if (!p.url) { parcaCal(calarSira); return; }
  if (calarSes.paused) calarSes.play().catch(() => {}); else calarSes.pause();
});
document.getElementById("calar-onceki").addEventListener("click", () => parcaCal(calarSira - 1));
document.getElementById("calar-sonraki").addEventListener("click", () => parcaCal(calarSira + 1));
calarSes.addEventListener("play", () => { calarOynat.textContent = "⏸"; });
calarSes.addEventListener("pause", () => { calarOynat.textContent = "▶"; });
calarSes.addEventListener("ended", () => {
  // sonraki sayfada calinabilen parcaya gec
  const sonraki = calarParcalar.findIndex((p, k) => k > calarSira && p.url);
  if (sonraki >= 0) parcaCal(sonraki);
});
calarSes.addEventListener("timeupdate", () => {
  const oran = calarSes.duration ? (calarSes.currentTime / calarSes.duration) * 100 : 0;
  calarIlerleme.style.width = oran + "%";
  calarSure.textContent = sureYaz(calarSes.currentTime);
});

// MSN tarzi "Dinliyor: ..." satiri (anlik mesajlasma yillarinda)
const durumSatiri = document.getElementById("durum-satiri");
let dinlenen = "";
function durumSatiriniGuncelle(sarki) {
  if (sarki !== undefined) dinlenen = sarki;
  const goster = msnDonemi(yil) && !tahmin.aktif && dinlenen;
  durumSatiri.hidden = !goster;
  durumSatiri.textContent = goster ? "🎵 " + donemBilgisi(yil).botAdi + " şunu dinliyor: " + dinlenen : "";
}

function msnDonemi(y) {
  return y >= 1999 && y <= 2012;
}

// Sayfayi secili yila gore ayarla
function yiliUygula() {
  const d = donemBilgisi(yil);
  document.body.classList.toggle("modern", d.tema === "modern");
  document.body.classList.toggle("web2", d.tema === "web2");
  document.body.classList.toggle("msn", msnDonemi(yil));
  document.body.dataset.yazi = yaziTipi(yil).ad;
  document.body.classList.toggle("modern", d.tema === "modern"); // arka plan icin tema once ayarlansin
  document.title = d.sayfaBasligi;
  pencereYazi.textContent = d.pencere;
  mesajKutusu.placeholder = d.placeholder;
  gonderDugmesi.textContent = d.gonder;
  document.getElementById("modern-ad").textContent = d.botAdi;
  document.getElementById("modern-alt-baslik").textContent = d.altBaslik || "";
  document.getElementById("modern-alt").textContent = d.altBilgi || "";
  document.getElementById("telif-yil").textContent = String(yil);
  bilgileriGoster();
  calarListesiniYukle();
  durumSatiriniGuncelle();
  sohbetiYukle();
}

// Zaman makinesi: yil degisince
yilSecici.addEventListener("change", () => {
  yil = parseInt(yilSecici.value, 10);
  guvenliYaz("retrobot_yil", String(yil));
  document.body.classList.add("gecis");
  setTimeout(yiliUygula, 300); // efektin ortasinda gorunumu degistir
  setTimeout(() => document.body.classList.remove("gecis"), 600);
  if (yil < 2000) RetroSes.modem();
});

// Sunucunun cevabi satir satir JSON olarak akar: {t: "parca"}, {id: "..."} ya da {hata: "..."}
async function cevabiOku(cevap, parcaGeldi) {
  const okuyucu = cevap.body.getReader();
  const cozucu = new TextDecoder();
  let tampon = "";
  const sonuc = { id: null, hata: null };
  const satiriIsle = (s) => {
    if (!s.trim()) return;
    const veri = JSON.parse(s);
    if (veri.t) parcaGeldi(veri.t);
    if (veri.id) sonuc.id = veri.id;
    if (veri.hata) sonuc.hata = veri.hata;
  };
  for (;;) {
    const { value, done } = await okuyucu.read();
    if (done) break;
    tampon += cozucu.decode(value, { stream: true });
    const satirlar = tampon.split("\n");
    tampon = satirlar.pop();
    satirlar.forEach(satiriIsle);
  }
  satiriIsle(tampon + cozucu.decode());
  return sonuc;
}

let gonderiliyor = false;

async function mesajGonder(mesaj) {
  if (gonderiliyor) return;
  gonderiliyor = true;
  const bot = aktifBot();
  const gecmis = gecmisiOku();
  satirEkle("kullanici", "Sen", mesaj);
  gonderDugmesi.disabled = true;
  const bekleme = satirEkle("sistem", "", tahmin.aktif ? "Gizemli Bot yazıyor..." : donemBilgisi(yil).yaziyor);

  let botSatiri = null;
  let metin = "";
  try {
    const cevap = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: mesaj, year: bot.yil, previous_id: gecmis.id, mode: bot.mod }),
    });
    if (!cevap.ok) {
      const veri = await cevap.json().catch(() => ({}));
      bekleme.remove();
      satirEkle("hata", "HATA", typeof veri.detail === "string" ? veri.detail : "Bir seyler ters gitti.");
      return;
    }

    // Gelen metin ekrana daktilo gibi akar (parcalar ne kadar hizli gelirse gelsin)
    let gosterilen = 0;
    let akisBitti = false;
    let daktilo = Promise.resolve();
    const daktiloyuBaslat = () => new Promise((bitti) => {
      const adim = () => {
        if (gosterilen < metin.length) {
          gosterilen = Math.min(metin.length, gosterilen + Math.max(2, Math.ceil((metin.length - gosterilen) / 40)));
          ifadeliYaz(botSatiri.querySelector(".yazi"), botMetniTemizle(metin.slice(0, gosterilen)));
          sohbet.scrollTop = sohbet.scrollHeight;
        }
        if (akisBitti && gosterilen >= metin.length) bitti();
        else setTimeout(adim, 30);
      };
      adim();
    });

    let sonuc;
    try {
      sonuc = await cevabiOku(cevap, (parca) => {
        metin += parca;
        if (!botSatiri) {
          bekleme.remove();
          botSatiri = satirEkle("bot", bot.botAdi, "");
          daktilo = daktiloyuBaslat();
        }
      });
    } finally {
      akisBitti = true;
    }
    await daktilo;
    bekleme.remove();

    const temiz = botMetniTemizle(metin);
    if (temiz) {
      gecmis.satirlar.push(["kullanici", "Sen", mesaj], ["bot", bot.botAdi, temiz]);
      if (sonuc.id) gecmis.id = sonuc.id;
      gecmisiYaz(gecmis);
      RetroSes.mesaj(bot.tema);
    }
    if (sonuc.hata) satirEkle("hata", "HATA", sonuc.hata);
    if (metin.includes("[TITRESIM]") && !tahmin.aktif) {
      satirEkle("sistem", "", bot.botAdi + " sana titreşim gönderdi!");
      pencereyiSalla();
    }
  } catch (hata) {
    bekleme.remove();
    satirEkle("hata", "HATA", "Sunucuya ulasilamadi. Telefon hatti mesgul olabilir!");
  } finally {
    gonderiliyor = false;
    gonderDugmesi.disabled = false;
    mesajKutusu.focus();
  }
}

form.addEventListener("submit", (olay) => {
  olay.preventDefault();
  const mesaj = mesajKutusu.value.trim();
  if (!mesaj || gonderiliyor) return;
  mesajKutusu.value = "";
  mesajGonder(mesaj);
});

// Titresim gonder (MSN gibi: arka arkaya gonderilemez)
const titresimDugmesi = document.getElementById("titresim");
let sonTitresim = 0;
titresimDugmesi.addEventListener("click", () => {
  if (gonderiliyor) return;
  if (Date.now() - sonTitresim < 10000) {
    satirEkle("sistem", "", "Çok sık titreşim gönderemezsin. Biraz bekle!");
    return;
  }
  sonTitresim = Date.now();
  pencereyiSalla();
  mesajGonder("*sana titreşim gönderdi*");
});

// Sesleri ac / kapat
const sesDugmesi = document.getElementById("ses-dugme");
function sesDugmesiniGoster() {
  sesDugmesi.textContent = RetroSes.acik ? "🔔" : "🔕";
}
sesDugmesi.addEventListener("click", () => { RetroSes.degistir(); sesDugmesiniGoster(); });
sesDugmesiniGoster();

sifirlaDugmesi.addEventListener("click", () => {
  gecmisiSil();
  karsilama();
});

// Canli tarih ve saat (her saniye guncellenir)
const tarihYazi = document.getElementById("tarih");
const saatYazi = document.getElementById("saat");
function saatiGuncelle() {
  const simdi = new Date();
  tarihYazi.textContent = simdi.toLocaleDateString("tr-TR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  saatYazi.textContent = simdi.toLocaleTimeString("tr-TR", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}
saatiGuncelle();
setInterval(saatiGuncelle, 1000);

// Sahte ziyaretci sayaci
let ziyaret = parseInt(guvenliOku("retrobot_sayac", "1336"), 10) + 1;
guvenliYaz("retrobot_sayac", String(ziyaret));
document.getElementById("sayac").textContent = String(ziyaret).padStart(6, "0");

yiliUygula();
mesajKutusu.focus();
