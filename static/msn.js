// Anlik mesajlasma (MSN tarzi) ozellikleri: yazi kodlarindan ifadeler, titresim ve sesler.
// Ifadeler standart emojilerle, sesler tarayicinin kendi ses motoruyla uretilir (dosya yok).

// ======================= IFADELER =======================
// ":)" gibi kodlar sohbette emojiye donusur. Harfli kodlar buyuk/kucuk harf fark etmez.
const IFADELER = {
  ":)": "🙂", ":-)": "🙂", ":D": "😃", ":-D": "😃", ";)": "😉", ";-)": "😉",
  ":(": "🙁", ":-(": "🙁", ":P": "😛", ":-P": "😛", ":O": "😮", ":-O": "😮",
  ":@": "😠", ":$": "😳", ":'(": "😢", ":S": "😕", ":|": "😐",
  "(H)": "😎", "(L)": "❤️", "(U)": "💔", "(K)": "💋", "(Y)": "👍", "(N)": "👎",
  "(*)": "⭐", "(8)": "🎵", "(C)": "☕", "(F)": "🌹", "(G)": "🎁", "(^)": "🎂",
  "(I)": "💡", "(S)": "🌙", "(#)": "☀️", "(E)": "📧", "(P)": "📷",
};

const IFADE_DESENI = new RegExp(
  Object.keys(IFADELER)
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "gi"
);

function ifadeBul(kod) {
  return IFADELER[kod] || IFADELER[kod.toUpperCase()];
}

// Metni kap'a yazar; kodlar emoji olur. innerHTML kullanilmaz, metin hep metin kalir.
function ifadeliYaz(kap, metin) {
  kap.textContent = "";
  let son = 0;
  for (const eslesme of metin.matchAll(IFADE_DESENI)) {
    const emoji = ifadeBul(eslesme[0]);
    if (!emoji) continue;
    if (eslesme.index > son) kap.appendChild(document.createTextNode(metin.slice(son, eslesme.index)));
    const s = document.createElement("span");
    s.className = "ifade";
    s.title = eslesme[0];
    s.textContent = emoji;
    kap.appendChild(s);
    son = eslesme.index + eslesme[0].length;
  }
  if (son < metin.length) kap.appendChild(document.createTextNode(metin.slice(son)));
}

// ======================= SESLER =======================
const RetroSes = {
  ctx: null,
  acik: (() => { try { return localStorage.getItem("retrobot_ses") !== "kapali"; } catch (e) { return true; } })(),

  degistir() {
    this.acik = !this.acik;
    try { localStorage.setItem("retrobot_ses", this.acik ? "acik" : "kapali"); } catch (e) {}
    return this.acik;
  },

  // Tarayicilar sesi ancak kullanici bir seye tikladiktan sonra acar
  hazirla() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.ana = this.ctx.createGain();
      this.ana.gain.value = 0.15;
      this.ana.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  },

  hazir() {
    return this.acik && this.ctx && this.ctx.state === "running";
  },

  ton(frekans, bas, sure, tip = "sine", ses = 0.5) {
    const t = this.ctx.currentTime + bas;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = tip;
    osc.frequency.setValueAtTime(frekans, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(ses, t + 0.01);
    g.gain.setValueAtTime(ses, t + Math.max(0.01, sure - 0.03));
    g.gain.linearRampToValueAtTime(0, t + sure);
    osc.connect(g).connect(this.ana);
    osc.start(t);
    osc.stop(t + sure + 0.02);
    return osc;
  },

  gurultu(bas, sure, ses = 0.3) {
    const t = this.ctx.currentTime + bas;
    const tampon = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * sure), this.ctx.sampleRate);
    const veri = tampon.getChannelData(0);
    for (let i = 0; i < veri.length; i++) veri[i] = Math.random() * 2 - 1;
    const kaynak = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    kaynak.buffer = tampon;
    g.gain.setValueAtTime(ses, t);
    g.gain.linearRampToValueAtTime(0, t + sure);
    kaynak.connect(g).connect(this.ana);
    kaynak.start(t);
  },

  // 56k modem baglanma sesi: numara cevirme, cevap tonu, el sikisma cizirtisi
  modem() {
    if (!this.hazir()) return;
    const tuslar = [[697, 1209], [770, 1336], [852, 1477], [697, 1336], [941, 1336], [770, 1209], [852, 1336]];
    tuslar.forEach(([a, b], i) => {
      this.ton(a, i * 0.12, 0.08, "sine", 0.25);
      this.ton(b, i * 0.12, 0.08, "sine", 0.25);
    });
    let t = tuslar.length * 0.12 + 0.25;
    this.ton(2100, t, 0.7, "sine", 0.2);
    t += 0.8;
    for (let i = 0; i < 6; i++) {
      this.ton(i % 2 ? 1180 : 980, t + i * 0.14, 0.13, "square", 0.08);
      this.gurultu(t + i * 0.14, 0.12, 0.12);
    }
    this.gurultu(t + 0.9, 0.8, 0.18);
  },

  // Yeni mesaj geldi
  mesaj(tema) {
    if (!this.hazir()) return;
    if (tema === "retro") {
      this.ton(1000, 0, 0.07, "square", 0.15);
    } else if (tema === "modern") {
      this.ton(660, 0, 0.12, "sine", 0.3);
      this.ton(990, 0.08, 0.2, "sine", 0.25);
    } else {
      this.ton(880, 0, 0.09, "triangle", 0.35);
      this.ton(1320, 0.09, 0.16, "triangle", 0.35);
    }
  },

  // Titresim: kisa, kalin bir vizilti
  titresim() {
    if (!this.hazir()) return;
    for (let i = 0; i < 5; i++) this.ton(i % 2 ? 70 : 90, i * 0.09, 0.08, "sawtooth", 0.35);
  },

  kazandin() {
    if (!this.hazir()) return;
    [523, 659, 784, 1047].forEach((f, i) => this.ton(f, i * 0.11, 0.18, "square", 0.18));
  },

  yanlis() {
    if (!this.hazir()) return;
    this.ton(330, 0, 0.12, "square", 0.15);
    this.ton(247, 0.12, 0.2, "square", 0.15);
  },
};

["pointerdown", "keydown"].forEach((olay) =>
  document.addEventListener(olay, () => RetroSes.hazirla(), { passive: true })
);

// ======================= TITRESIM =======================
function pencereyiSalla() {
  const pencere = document.querySelector(".pencere");
  if (!pencere) return;
  pencere.classList.remove("titriyor");
  void pencere.offsetWidth; // animasyonu bastan baslat
  pencere.classList.add("titriyor");
  RetroSes.titresim();
}
