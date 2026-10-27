// Yila gore arka plan rengi ve deseni

// Kucuk SVG desen karolari
function svgKaro(boyut, icerik) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${boyut}' height='${boyut}'>${icerik}</svg>`;
  return { resim: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, boyut: `${boyut}px ${boyut}px` };
}

const DESENLER = {
  yildiz: (r) => svgKaro(90, `<g fill='${r}'>
    <path d='M15 8l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z'/>
    <path d='M60 30l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z'/>
    <path d='M32 62l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z'/>
    <path d='M78 72l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z'/></g>`),
  nokta: (r) => svgKaro(24, `<circle cx='6' cy='6' r='2' fill='${r}'/><circle cx='18' cy='18' r='2' fill='${r}'/>`),
  damali: (r) => svgKaro(40, `<rect width='20' height='20' fill='${r}'/><rect x='20' y='20' width='20' height='20' fill='${r}'/>`),
  cizgili: (r) => svgKaro(28, `<path d='M-7 7l14-14M0 28L28 0M21 35l14-14' stroke='${r}' stroke-width='6'/>`),
  zikzak: (r) => svgKaro(40, `<path d='M0 15l10-10 10 10 10-10 10 10M0 35l10-10 10 10 10-10 10 10' fill='none' stroke='${r}' stroke-width='3'/>`),
  ucgen: (r, r2) => svgKaro(80, `<path d='M10 20l10-14 10 14z' fill='${r}'/>
    <path d='M50 50q5-8 10 0t10 0' fill='none' stroke='${r2 || r}' stroke-width='3'/>
    <circle cx='60' cy='15' r='5' fill='none' stroke='${r2 || r}' stroke-width='3'/>
    <rect x='15' y='55' width='12' height='12' fill='${r2 || r}' transform='rotate(20 21 61)'/>
    <path d='M40 72l6-6M44 72l6-6M48 72l6-6' stroke='${r}' stroke-width='2'/>`),
  dalga: (r) => svgKaro(40, `<path d='M0 10q10-8 20 0t20 0M0 30q10-8 20 0t20 0' fill='none' stroke='${r}' stroke-width='2.5'/>`),
  kalp: (r) => svgKaro(50, `<path d='M12 16c-4-6-12-2-8 4l8 8 8-8c4-6-4-10-8-4z' fill='${r}'/>
    <path d='M37 41c-3-4-9-1-6 3l6 6 6-6c3-4-3-7-6-3z' fill='${r}'/>`),
  gulen: (r) => svgKaro(60, `<g transform='translate(15 15)'><circle r='10' fill='${r}'/>
    <circle cx='-3.5' cy='-3' r='1.5' fill='#000'/><circle cx='3.5' cy='-3' r='1.5' fill='#000'/>
    <path d='M-5 2q5 6 10 0' fill='none' stroke='#000' stroke-width='1.5'/></g>
    <g transform='translate(45 45)'><circle r='10' fill='${r}'/>
    <circle cx='-3.5' cy='-3' r='1.5' fill='#000'/><circle cx='3.5' cy='-3' r='1.5' fill='#000'/>
    <path d='M-5 2q5 6 10 0' fill='none' stroke='#000' stroke-width='1.5'/></g>`),
  izgara: (r) => svgKaro(32, `<path d='M32 0H0V32' fill='none' stroke='${r}' stroke-width='1'/>`),
  baloncuk: (r) => svgKaro(70, `<circle cx='15' cy='15' r='9' fill='none' stroke='${r}' stroke-width='2'/>
    <circle cx='50' cy='40' r='14' fill='none' stroke='${r}' stroke-width='2'/>
    <circle cx='22' cy='58' r='5' fill='none' stroke='${r}' stroke-width='2'/>`),
  matris: (r) => svgKaro(48, `<g fill='${r}' font-family='monospace' font-size='12'>
    <text x='2' y='12'>1</text><text x='26' y='12'>0</text><text x='14' y='26'>0</text>
    <text x='38' y='26'>1</text><text x='2' y='40'>0</text><text x='26' y='40'>1</text></g>`),
  petek: (r) => svgKaro(42, `<path d='M10.5 0l10.5 6v12l-10.5 6L0 18V6zM31.5 18l10.5 6v12l-10.5 6L21 36V24z' fill='none' stroke='${r}' stroke-width='1.5'/>`),
  cicek: (r) => svgKaro(60, `<g fill='${r}' transform='translate(18 18)'>
    <circle cy='-6' r='4'/><circle cy='6' r='4'/><circle cx='-6' r='4'/><circle cx='6' r='4'/></g>
    <circle cx='18' cy='18' r='3' fill='#ffd23b'/>
    <g fill='${r}' transform='translate(46 46)'>
    <circle cy='-4' r='3'/><circle cy='4' r='3'/><circle cx='-4' r='3'/><circle cx='4' r='3'/></g>`),
};

// Ekose (kareli flanel) CSS ile cizilir
function ekose(r1, r2) {
  return {
    resim: `repeating-linear-gradient(0deg, ${r2}88 0 12px, transparent 12px 40px),
            repeating-linear-gradient(90deg, ${r2}88 0 12px, transparent 12px 40px)`,
    boyut: "auto",
  };
}

// [arka plan rengi, desen, desen rengi, (ikinci renk), aciklama]
const ARKAPLANLAR = {
  1990: ["#1fb5ad", "ucgen", "#ff4fa3", "#ffe14d", "Memphis deseni"],
  1991: ["#000000", "zikzak", "#ff00ff", null, "Neon zikzak"],
  1992: ["#8b1a1a", "ekose", "#8b1a1a", "#111111", "Grunge ekose gömlek"],
  1993: ["#c0c0c0", "damali", "#a8a8a8", null, "Windows 3.1 karoları"],
  1994: ["#ff8fc8", "dalga", "#ffffff", null, "Pastel dalgalar"],
  1995: ["#008080", "nokta", "#0a9a9a", null, "Windows 95 masaüstü"],
  1996: ["#5b2c83", "gulen", "#ffe14d", null, "Gülen yüzler"],
  1997: ["#800020", "yildiz", "#000000", null, "Bordo yıldızlar"],
  1998: ["#0095b6", "cizgili", "#1aa9c9", null, "iMac Bondi mavisi"],
  1999: ["#000000", "matris", "#00b300", null, "Matrix kodu"],
  2000: ["#c9ced6", "baloncuk", "#ffffff", null, "Y2K gümüş baloncuklar"],
  2001: ["#f2f2f2", "nokta", "#cfcfcf", null, "Beyaz minimal"],
  2002: ["#3b5b8c", "cizgili", "#46699e", null, "Kot mavisi"],
  2003: ["#ffffff", "damali", "#1a1a1a", null, "Kaykay damalısı"],
  2004: ["#ff69b4", "yildiz", "#ffffff", null, "Pembe simli yıldızlar"],
  2005: ["#bfe3ff", "cizgili", "#cfeaff", null, "Web 2.0 gökyüzü"],
  2006: ["#9acd32", "cizgili", "#ffa53b", null, "Limon ve portakal çizgileri"],
  2007: ["#111111", "nokta", "#2c2c2c", null, "Parlak siyah"],
  2008: ["#2e8b57", "cicek", "#ffffff", null, "Yeşil çiçekler"],
  2009: ["#ffcc00", "izgara", "#e0b000", null, "Sarı kareli defter"],
  2010: ["#4fc3f7", "baloncuk", "#ffffff", null, "Gökyüzü baloncukları"],
  2011: ["#ff7f50", "ucgen", "#ffffff", "#ffe0d1", "Hipster üçgenler"],
  2012: ["#2f2f2f", "zikzak", "#ffd23b", null, "Şerit (chevron) zikzak"],
  2013: ["#0d1b2a", "ucgen", "#1b3350", "#16304a", "Düz tasarım şekilleri"],
  2014: ["#160f2e", "cizgili", "#1d1640", null, "Mor çizgiler"],
  2015: ["#071a1a", "petek", "#0f3333", null, "Turkuaz petek"],
  2016: ["#1b0f24", "dalga", "#3a1f4f", null, "Vaporwave mor dalgalar"],
  2017: ["#24101b", "nokta", "#4a2238", null, "Milenyum pembesi"],
  2018: ["#0f172a", "izgara", "#1c2740", null, "Gece ızgarası"],
  2019: ["#140a1f", "baloncuk", "#2a1740", null, "Mor baloncuklar"],
  2020: ["#0b1320", "nokta", "#1b2a40", null, "Evde kal noktaları"],
  2021: ["#111a0e", "cicek", "#26381f", null, "Cottagecore çiçekleri"],
  2022: ["#10101a", "yildiz", "#262640", null, "Y2K'nın dönüşü"],
  2023: ["#1f0b17", "kalp", "#4a1d38", null, "Barbie pembesi kalpler"],
  2024: ["#0e1a0b", "zikzak", "#2c4a14", null, "Limon yeşili zikzak"],
  2025: ["#0c0f1a", "dalga", "#1c2338", null, "Gece dalgaları"],
  2026: ["#070a14", "nokta", "#121a2e", null, "Gece mavisi"],
  2035: ["#03030a", "izgara", "#0c3a4a", null, "Neon ızgara"],
};

function arkaPlanUygula(yil, tema) {
  const a = ARKAPLANLAR[yil];
  const govde = document.body;
  if (!a) return "";
  const [renk, desenAdi, desenRengi, ikinciRenk, aciklama] = a;
  const desen = desenAdi === "ekose" ? ekose(desenRengi, ikinciRenk) : DESENLER[desenAdi](desenRengi, ikinciRenk);

  let resimler = [desen.resim];
  let boyutlar = [desen.boyut];
  // Modern temada hafif renkli isiltilar da olsun
  if (tema === "modern") {
    resimler = [
      "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(124, 92, 255, 0.28), transparent 70%)",
      "radial-gradient(ellipse 50% 45% at 90% 85%, rgba(0, 212, 200, 0.2), transparent 70%)",
    ].concat(resimler);
    boyutlar = ["auto", "auto"].concat(boyutlar);
  }
  govde.style.backgroundColor = renk;
  govde.style.backgroundImage = resimler.join(", ");
  govde.style.backgroundSize = boyutlar.join(", ");
  govde.style.backgroundAttachment = "fixed";
  return aciklama;
}
