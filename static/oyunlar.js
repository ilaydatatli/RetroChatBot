// Oyun Kosesi: Yilan ve Zipzip (platform oyunu)
// Iki oyun ayni tuvali (canvas) kullanir; ayni anda yalnizca biri calisir.
// Muzik ve ses efektleri tarayicinin kendi ses motoruyla (Web Audio) uretilir,
// melodiler bu oyun icin yazilmis ozgun melodilerdir.

(function () {
  const tuval = document.getElementById("oyun-tuvali");
  const ctx = tuval.getContext("2d");
  const skorYazi = document.getElementById("oyun-skor");
  const sekmeler = document.querySelectorAll(".oyun-sekme");
  const sesDugmesi = document.getElementById("oyun-ses");
  const G = tuval.width;   // 320
  const Y = tuval.height;  // 240

  const tuslar = {};
  let aktifOyun = null;

  function guvenliOku(a, v) { try { return localStorage.getItem(a) || v; } catch (e) { return v; } }
  function guvenliYaz(a, v) { try { localStorage.setItem(a, v); } catch (e) {} }

  // ======================= SES =======================
  const Ses = {
    ctx: null,
    acik: guvenliOku("oyun_ses", "acik") === "acik",
    calan: null,

    hazirla() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC();
        this.ana = this.ctx.createGain();
        this.ana.gain.value = 0.18;
        this.ana.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return true;
    },

    // nota adindan frekans: "C5", "F#4" ...
    frekans(nota) {
      const adlar = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
      const m = nota.match(/^([A-G]#?)(\d)$/);
      const n = adlar[m[1]] + (parseInt(m[2], 10) + 1) * 12;
      return 440 * Math.pow(2, (n - 69) / 12);
    },

    ton(frek, bas, sure, tip, ses, bitisFrek) {
      if (!this.acik || !this.hazirla()) return;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = tip || "square";
      o.frequency.setValueAtTime(frek, bas);
      if (bitisFrek) o.frequency.exponentialRampToValueAtTime(bitisFrek, bas + sure);
      g.gain.setValueAtTime(ses || 0.5, bas);
      g.gain.exponentialRampToValueAtTime(0.001, bas + sure);
      o.connect(g);
      g.connect(this.ana);
      o.start(bas);
      o.stop(bas + sure + 0.02);
    },

    efekt(ad) {
      if (!this.acik || !this.hazirla()) return;
      const s = this.ctx.currentTime;
      const f = (n) => this.frekans(n);
      if (ad === "zipla") this.ton(300, s, 0.16, "square", 0.35, 700);
      if (ad === "altin") { this.ton(f("C6"), s, 0.07, "triangle", 0.6); this.ton(f("E6"), s + 0.06, 0.07, "triangle", 0.6); this.ton(f("G6"), s + 0.12, 0.14, "triangle", 0.6); }
      if (ad === "ezdi") this.ton(400, s, 0.15, "square", 0.4, 90);
      if (ad === "yem") { this.ton(f("A5"), s, 0.06, "square", 0.35); this.ton(f("D6"), s + 0.05, 0.08, "square", 0.35); }
      if (ad === "yandi") ["E5", "D#5", "D5", "C#5"].forEach((n, i) => this.ton(f(n), s + i * 0.16, 0.18, "square", 0.4));
      if (ad === "kazandi") ["C5", "E5", "G5", "C6", "G5", "C6"].forEach((n, i) => this.ton(f(n), s + i * 0.11, i === 5 ? 0.4 : 0.12, "square", 0.4));
    },

    // Melodi: [nota ya da null, sekizlik sayisi]
    muzikBaslat(parca) {
      this.muzikDurdur();
      if (!this.acik || !this.hazirla()) return;
      const sekizlik = 60 / parca.tempo / 2;
      let sonraki = this.ctx.currentTime + 0.05;
      let i = 0, j = 0, basZaman = sonraki;
      const planla = () => {
        // ~0.3 sn ilerisini planla
        while (sonraki < this.ctx.currentTime + 0.3) {
          const [nota, uz] = parca.melodi[i % parca.melodi.length];
          if (nota) this.ton(this.frekans(nota), sonraki, uz * sekizlik * 0.9, "square", 0.22);
          sonraki += uz * sekizlik;
          i++;
        }
        while (basZaman < this.ctx.currentTime + 0.3) {
          const [nota, uz] = parca.bas[j % parca.bas.length];
          if (nota) this.ton(this.frekans(nota), basZaman, uz * sekizlik * 0.8, "triangle", 0.5);
          basZaman += uz * sekizlik;
          j++;
        }
      };
      planla();
      this.calan = setInterval(planla, 100);
    },

    muzikDurdur() { clearInterval(this.calan); this.calan = null; },
  };

  // Ozgun neseli melodiler
  const ZIPZIP_MUZIK = {
    tempo: 150,
    melodi: [
      ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["F5", 1], ["A5", 1], ["G5", 2],
      ["E5", 1], ["G5", 1], ["C6", 1], ["G5", 1], ["A5", 1], ["G5", 1], ["E5", 2],
      ["D5", 1], ["F5", 1], ["A5", 1], ["F5", 1], ["G5", 1], ["F5", 1], ["E5", 1], ["D5", 1],
      ["C5", 1], ["E5", 1], ["D5", 1], ["B4", 1], ["C5", 2], [null, 2],
      ["G4", 1], ["C5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["F5", 2],
      ["E5", 1], ["D5", 1], ["C5", 1], ["D5", 1], ["E5", 2], ["G5", 2],
      ["A5", 1], ["G5", 1], ["F5", 1], ["E5", 1], ["D5", 1], ["E5", 1], ["F5", 1], ["D5", 1],
      ["C5", 2], ["G4", 1], ["B4", 1], ["C5", 2], [null, 2],
    ],
    bas: [
      ["C3", 2], ["G3", 2], ["F3", 2], ["C3", 2], ["C3", 2], ["G3", 2], ["A2", 2], ["E3", 2],
      ["D3", 2], ["A3", 2], ["G2", 2], ["D3", 2], ["C3", 2], ["G2", 2], ["C3", 2], ["G3", 2],
    ],
  };

  const YILAN_MUZIK = {
    tempo: 132,
    melodi: [
      ["G4", 1], [null, 1], ["B4", 1], ["D5", 1], ["G5", 2], ["D5", 2],
      ["E5", 1], ["D5", 1], ["B4", 1], ["G4", 1], ["A4", 2], [null, 2],
      ["G4", 1], [null, 1], ["B4", 1], ["D5", 1], ["E5", 2], ["C5", 2],
      ["B4", 1], ["A4", 1], ["G4", 1], ["F#4", 1], ["G4", 2], [null, 2],
    ],
    bas: [["G2", 2], ["D3", 2], ["G2", 2], ["D3", 2], ["C3", 2], ["G2", 2], ["D3", 2], ["A2", 2]],
  };

  function sesDugmesiniGuncelle() { sesDugmesi.textContent = Ses.acik ? "🔊" : "🔇"; }
  sesDugmesi.addEventListener("click", () => {
    Ses.acik = !Ses.acik;
    guvenliYaz("oyun_ses", Ses.acik ? "acik" : "kapali");
    sesDugmesiniGuncelle();
    if (!Ses.acik) Ses.muzikDurdur();
    else if (aktifOyun && aktifOyun.durum === "oynuyor") Ses.muzikBaslat(aktifOyun.muzik);
  });
  sesDugmesiniGuncelle();

  function yaziOrtala(metin, y, boyut, renk) {
    ctx.font = "bold " + (boyut || 16) + "px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText(metin, G / 2 + 2, y + 2);
    ctx.fillStyle = renk || "#fff";
    ctx.fillText(metin, G / 2, y);
    ctx.textAlign = "left";
  }

  function kaplama(baslik, alt, ust) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, G, Y);
    if (ust) yaziOrtala(ust, Y / 2 - 40, 13, "#ffb3d1");
    yaziOrtala(baslik, Y / 2 - 8, 22, "#ffe14d");
    yaziOrtala(alt, Y / 2 + 18, 12, "#ffffff");
  }

  // ======================= YILAN =======================
  const yilan = {
    hucre: 16,
    durum: "bekliyor", // bekliyor | oynuyor | bitti
    zamanlayici: null,
    muzik: YILAN_MUZIK,
    rekor: parseInt(guvenliOku("yilan_rekor", "0"), 10),

    baslat() {
      this.govde = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
      this.yon = { x: 1, y: 0 };
      this.sonrakiYon = { x: 1, y: 0 };
      this.skor = 0;
      this.yemKoy();
      this.durum = "oynuyor";
      clearInterval(this.zamanlayici);
      this.zamanlayici = setInterval(() => this.adim(), 120);
      Ses.muzikBaslat(this.muzik);
    },

    yemKoy() {
      const sx = G / this.hucre, sy = Y / this.hucre;
      do {
        this.yem = { x: Math.floor(Math.random() * sx), y: Math.floor(Math.random() * sy) };
      } while (this.govde.some((p) => p.x === this.yem.x && p.y === this.yem.y));
    },

    tus(k) {
      const yonler = {
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
      };
      if (this.durum !== "oynuyor") {
        if (k === " " || k === "Enter") this.baslat();
        return;
      }
      const yeni = yonler[k];
      if (!yeni) return;
      if (yeni[0] === -this.yon.x && yeni[1] === -this.yon.y) return; // geri donemez
      this.sonrakiYon = { x: yeni[0], y: yeni[1] };
    },

    adim() {
      this.yon = this.sonrakiYon;
      const bas = { x: this.govde[0].x + this.yon.x, y: this.govde[0].y + this.yon.y };
      const sx = G / this.hucre, sy = Y / this.hucre;
      const carpti =
        bas.x < 0 || bas.y < 0 || bas.x >= sx || bas.y >= sy ||
        this.govde.some((p) => p.x === bas.x && p.y === bas.y);
      if (carpti) {
        this.durum = "bitti";
        clearInterval(this.zamanlayici);
        Ses.muzikDurdur();
        Ses.efekt("yandi");
        if (this.skor > this.rekor) {
          this.rekor = this.skor;
          guvenliYaz("yilan_rekor", String(this.rekor));
        }
        this.ciz();
        return;
      }
      this.govde.unshift(bas);
      if (bas.x === this.yem.x && bas.y === this.yem.y) {
        this.skor += 10;
        Ses.efekt("yem");
        this.yemKoy();
      } else {
        this.govde.pop();
      }
      this.ciz();
    },

    ciz() {
      const h = this.hucre;
      ctx.fillStyle = "#0b3d0b";
      ctx.fillRect(0, 0, G, Y);
      ctx.fillStyle = "#0e470e";
      for (let x = 0; x < G / h; x++)
        for (let y = 0; y < Y / h; y++)
          if ((x + y) % 2 === 0) ctx.fillRect(x * h, y * h, h, h);
      if (this.govde) {
        // yem: elma
        ctx.fillStyle = "#ff3b3b";
        ctx.beginPath();
        ctx.arc(this.yem.x * h + h / 2, this.yem.y * h + h / 2 + 1, h / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff88";
        ctx.fillRect(this.yem.x * h + 5, this.yem.y * h + 6, 2, 3);
        ctx.fillStyle = "#3bd13b";
        ctx.fillRect(this.yem.x * h + h / 2, this.yem.y * h, 4, 3);
        // yilan
        this.govde.forEach((p, i) => {
          ctx.fillStyle = i === 0 ? "#b6ff3b" : i % 2 ? "#7ee02b" : "#6cc824";
          ctx.fillRect(p.x * h + 1, p.y * h + 1, h - 2, h - 2);
        });
        const b = this.govde[0];
        ctx.fillStyle = "#fff";
        ctx.fillRect(b.x * h + 3, b.y * h + 3, 4, 4);
        ctx.fillRect(b.x * h + 9, b.y * h + 3, 4, 4);
        ctx.fillStyle = "#000";
        ctx.fillRect(b.x * h + 4 + this.yon.x, b.y * h + 4 + this.yon.y, 2, 2);
        ctx.fillRect(b.x * h + 10 + this.yon.x, b.y * h + 4 + this.yon.y, 2, 2);
      }
      skorYazi.textContent = "Skor: " + (this.skor || 0) + "  ·  Rekor: " + this.rekor;
      if (this.durum === "bekliyor") kaplama("🐍 YILAN", "Başlamak için tıkla ya da SPACE");
      if (this.durum === "bitti") kaplama("OYUN BİTTİ", "Skor " + this.skor + " · Tekrar için SPACE");
    },

    dur() {
      clearInterval(this.zamanlayici);
      Ses.muzikDurdur();
      if (this.durum === "oynuyor") this.durum = "bekliyor";
    },
  };

  // ======================= ZIPZIP (platform) =======================
  const T = 16; // karo boyutu
  // Bolum haritalari: # zemin, B blok/bulut, o altin, e dusman, F bayrak
  // (her bolumun bayraga ve tum altinlara ulasilabildigi fizik benzetimiyle denendi)
  const BOLUMLER = [
    {
      tema: "cayir",
      ad: "🌼 Çayır",
      dusmanHizi: 0.6,
      harita: [
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        ".....................................oo....................................................o.o..................................................................",
        "....................................BBB............................o.o....................BBBB..................................................................",
        "..................................................................BBBB..........................................................................................",
        ".............ooo...............o.o......................o.o...........................o..............o.o...............o.o.o...............o.o........#.........",
        "............BBBB..............BBBBB....................BBBBBB..........#.............BBB............BBBBB.............BBBBBB..............BBBB.......##.........",
        "......................................................................##............................................................................###.........",
        "..........................o................o.........................###..o....................o..............................o....................####.........",
        "..................e.....................e.................e.........####...e....................e.......e...................e...........e.........#####....F....",
        "######################...######################...############################...#############################...##################...##########################",
        "######################...######################...############################...#############################...##################...##########################",
      ],
    },
    {
      tema: "magara",
      ad: "🪨 Mağara",
      dusmanHizi: 0.8,
      harita: [
        "################################################################################################################################################################",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "...................................o....................................................................o...............................o.......................",
        "..................................BBB..................................................................BBB.............................BBB......................",
        "...............................................o................................................................................................................",
        "...............oo.............o.o.............BBB....o...................o.......o.o...............o................o.o.............o...............o...........",
        "..............BBB............BBBB....oo.............BBB..............o..BB......BBBB..............BBB..............BBBB............BBB.............BBB..........",
        ".....................o.....................................o..#.....BB.....................oo................o..........#....oo..............o..................",
        "............................................#.................#.................................#.......................#.......................................",
        "................e..........e................#.....e....e......#...............e.......e.........#....e............e.....#..........e..................e....F....",
        "####################...#############....##################...#####.........###############....##############...#############....############...#################",
        "####################...#############....##################...#####.........###############....##############...#############....############...#################",
      ],
    },
    {
      tema: "bulutlar",
      ad: "☁️ Bulutlar",
      dusmanHizi: 0.7,
      harita: [
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        "................................................................................................................................................................",
        ".....................................................o...................................o.....................o...oo..o........................................",
        ".....................o........o...............o.........oo..o..............o........o.o...........................BBBB..........................................",
        "...............o.........o.o........o............o.....BBBB.............o..........BBBBB........o...........o.............oeo........o.....o....................",
        "...................o....BBBBB....o..............BBBB...........o.eo....BBB....o.............o..............BBBB..........BBBBB....o............o................",
        "............oo...BBBB...........BBBB....o.eo..................BBBBBB.........BBB...........BBBB.....oeo..........................BBB....o.....BBBBo.............",
        "...........BBBB........................BBBBBB.....................................................BBBBBB...............................BBBB.....................",
        "............................................................................................................................................................F...",
        "#########...........................................................................................................................................############",
        "#########...........................................................................................................................................############",
      ],
    },
  ];

  // Her bolumun renkleri
  const TEMALAR = {
    cayir: {
      gok: ["#5ec8ff", "#d8f3ff"], gunes: "#fff3a0", tepeler: ["#a6e3a1", "#7fd17a"], bulut: "#fff",
      toprak: ["#b8743a", "#a0622d"], cim: ["#4ccf4c", "#3aa83a", "#7cf07c"], blok: ["#ff7fb0", "#ffa94d"],
      dusman: ["#9b4dff", "#c79bff", "#3a0a6b"], kus: 4,
    },
    magara: {
      gok: ["#120b24", "#34244f"], gunes: null, tepeler: ["#22183a", "#2d2149"], bulut: null,
      toprak: ["#5a4a6e", "#4a3c5c"], cim: ["#8a7aa8", "#6e5f8a", "#b3a6cc"], blok: ["#4fd1c5", "#9f7aea"],
      dusman: ["#3ccf6e", "#9af0b5", "#0c4a24"], kus: 0,
    },
    bulutlar: {
      gok: ["#ff9ed1", "#ffe3b8"], gunes: "#fff6d5", tepeler: null, bulut: "rgba(255,255,255,0.6)",
      toprak: ["#b8743a", "#a0622d"], cim: ["#4ccf4c", "#3aa83a", "#7cf07c"], blok: null,
      dusman: ["#ff5f5f", "#ffb0b0", "#6b0a0a"], kus: 6,
    },
  };

  // Zemin uzerindeki suslemeler: cayirda cali ve cicek, magarada kristal ve mantar
  function susleriUret(harita, tema) {
    const susler = [];
    for (let x = 3; x < harita[0].length - 4; x += 7) {
      if (harita[13][x] !== "#" || harita[12][x] !== ".") continue;
      const magara = tema === "magara";
      susler.push({
        x: x * T + ((x * 37) % 9),
        tur: magara ? (x % 3 === 0 ? "kristal" : "mantar") : (x % 3 === 0 ? "cali" : "cicek"),
        renk: (magara ? ["#4fd1c5", "#9f7aea", "#f687b3", "#63b3ed"] : ["#ff5fa2", "#ffd23b", "#ffffff", "#7fc8ff"])[x % 4],
      });
    }
    return susler;
  }

  // Gokyuzunde suzulen renkli kuslar
  const KUSLAR = [
    { renk: "#ff4d4d", kanat: "#c81e1e", y: 26, hiz: 0.55, bas: 0, faz: 0 },
    { renk: "#3da5ff", kanat: "#1f6fc2", y: 58, hiz: 0.4, bas: 120, faz: 1.7 },
    { renk: "#ffd23b", kanat: "#d19a00", y: 40, hiz: 0.7, bas: 230, faz: 3.1 },
    { renk: "#4cd964", kanat: "#239a3a", y: 72, hiz: 0.48, bas: 300, faz: 4.4 },
    { renk: "#ff6bd6", kanat: "#c2329f", y: 18, hiz: 0.62, bas: 60, faz: 2.3 },
    { renk: "#ff9f1a", kanat: "#c46d00", y: 88, hiz: 0.36, bas: 190, faz: 5.2 },
  ];

  function kuslariCiz(sayi, kam, zaman) {
    const yol = G + 60;
    for (let i = 0; i < sayi; i++) {
      const k = KUSLAR[i];
      const x = (((k.bas + zaman * k.hiz - kam * 0.15) % yol) + yol) % yol - 30;
      const y = k.y + Math.sin(zaman * 0.04 + k.faz) * 5;
      const cirpma = Math.sin(zaman * 0.3 + k.faz);
      // arka kanat
      ctx.fillStyle = k.kanat;
      ctx.beginPath(); ctx.moveTo(x - 1, y - 1); ctx.lineTo(x - 6, y - 1 - cirpma * 6); ctx.lineTo(x + 2, y - 1); ctx.fill();
      // govde ve bas
      ctx.fillStyle = k.renk;
      ctx.beginPath(); ctx.ellipse(x, y, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.arc(x + 5, y - 2, 2.8, 0, Math.PI * 2); ctx.fill();
      // kuyruk
      ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 9, y - 3); ctx.lineTo(x - 9, y + 2); ctx.fill();
      // gaga ve goz
      ctx.fillStyle = "#ff9500";
      ctx.beginPath(); ctx.moveTo(x + 7.5, y - 2.8); ctx.lineTo(x + 10.5, y - 1.8); ctx.lineTo(x + 7.5, y - 0.8); ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillRect(x + 5.5, y - 3, 1.2, 1.2);
      // on kanat
      ctx.fillStyle = k.kanat;
      ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x + 1, y - cirpma * 8); ctx.lineTo(x + 3, y); ctx.fill();
    }
  }

  const zipzip = {
    durum: "bekliyor",
    dongu: null,
    muzik: ZIPZIP_MUZIK,
    zaman: 0,

    // Durum "bolumBitti" ise sonraki bolum, "yandi" ise ayni bolum bastan, aksi halde yeni oyun
    baslat() {
      if (this.durum === "bolumBitti") {
        this.bolum++;
        this.bolumBasiAltin = this.altin;
      } else if (this.durum !== "yandi") {
        this.bolum = 0;
        this.bolumBasiAltin = 0;
      }
      const bolum = BOLUMLER[this.bolum];
      this.tema = TEMALAR[bolum.tema];
      this.harita = bolum.harita.map((satir) => satir.split(""));
      this.susler = susleriUret(this.harita, bolum.tema);
      this.altin = this.bolumBasiAltin;
      this.zaman = 0;
      this.parcaciklar = [];
      this.dusmanlar = [];
      for (let y = 0; y < this.harita.length; y++)
        for (let x = 0; x < this.harita[0].length; x++)
          if (this.harita[y][x] === "e") {
            this.dusmanlar.push({ x: x * T, y: y * T + 4, g: 14, y2: 12, vx: -bolum.dusmanHizi, canli: true, ezik: 0 });
            this.harita[y][x] = ".";
          }
      this.oyuncu = { x: 2 * T, y: 10 * T, g: 12, y2: 14, vx: 0, vy: 0, yerde: false, bakis: 1, adim: 0 };
      this.kamera = 0;
      this.durum = "oynuyor";
      Ses.muzikBaslat(this.muzik);
      cancelAnimationFrame(this.dongu);
      // Ekranin yenileme hizindan bagimsiz: saniyede sabit 60 adim
      let onceki = performance.now(), birikim = 0;
      const kare = (simdi) => {
        birikim += Math.min(simdi - onceki, 100);
        onceki = simdi;
        while (birikim >= 1000 / 60 && this.durum === "oynuyor") { this.guncelle(); birikim -= 1000 / 60; }
        this.ciz();
        if (this.durum === "oynuyor") this.dongu = requestAnimationFrame(kare);
      };
      this.dongu = requestAnimationFrame(kare);
    },

    bitir(durum) {
      this.durum = durum;
      Ses.muzikDurdur();
      Ses.efekt(durum === "yandi" ? "yandi" : "kazandi");
    },

    bayragaUlasti() {
      if (this.bolum < BOLUMLER.length - 1) { this.bitir("bolumBitti"); return; }
      this.yeniRekor = this.altin > parseInt(guvenliOku("zipzip_rekor", "0"), 10);
      if (this.yeniRekor) guvenliYaz("zipzip_rekor", String(this.altin));
      this.bitir("kazandi");
    },

    kati(px, py) {
      const tx = Math.floor(px / T), ty = Math.floor(py / T);
      if (ty < 0 || tx < 0 || tx >= this.harita[0].length) return tx < 0;
      if (ty >= this.harita.length) return false;
      const c = this.harita[ty][tx];
      return c === "#" || c === "B";
    },

    hareketEt(n, dx, dy) {
      n.x += dx;
      if (dx !== 0) {
        const kenar = dx > 0 ? n.x + n.g : n.x;
        if (this.kati(kenar, n.y + 1) || this.kati(kenar, n.y + n.y2 - 1)) {
          n.x = dx > 0 ? Math.floor(kenar / T) * T - n.g - 0.01 : (Math.floor(kenar / T) + 1) * T + 0.01;
          n.duvar = true;
        }
      }
      n.y += dy;
      n.yerde = false;
      if (dy !== 0) {
        const kenar = dy > 0 ? n.y + n.y2 : n.y;
        if (this.kati(n.x + 1, kenar) || this.kati(n.x + n.g - 1, kenar)) {
          if (dy > 0) { n.y = Math.floor(kenar / T) * T - n.y2; n.yerde = true; }
          else n.y = (Math.floor(kenar / T) + 1) * T;
          n.vy = 0;
        }
      }
    },

    parcacik(x, y, metin, renk) {
      this.parcaciklar.push({ x, y, metin, renk, omur: 40 });
    },

    guncelle() {
      this.zaman++;
      const o = this.oyuncu;
      const sol = tuslar.ArrowLeft || tuslar.a || tuslar.A || tuslar.dokunSol;
      const sag = tuslar.ArrowRight || tuslar.d || tuslar.D || tuslar.dokunSag;
      const zipla = tuslar.ArrowUp || tuslar.w || tuslar.W || tuslar[" "] || tuslar.dokunZipla;
      o.vx = sag ? 2 : sol ? -2 : 0;
      if (o.vx) { o.bakis = Math.sign(o.vx); o.adim += 0.25; }
      if (zipla && o.yerde) { o.vy = -7.6; Ses.efekt("zipla"); }
      o.vy = Math.min(o.vy + 0.42, 8);
      this.hareketEt(o, o.vx, o.vy);

      for (const [cx, cy] of [[o.x + 2, o.y + 2], [o.x + o.g - 2, o.y + o.y2 - 2]]) {
        const tx = Math.floor(cx / T), ty = Math.floor(cy / T);
        if (this.harita[ty] && this.harita[ty][tx] === "o") {
          this.harita[ty][tx] = ".";
          this.altin++;
          Ses.efekt("altin");
          this.parcacik(tx * T + 8, ty * T, "+1", "#ffe14d");
        }
        if (this.harita[ty] && this.harita[ty][tx] === "F") { this.bayragaUlasti(); return; }
      }

      for (const d of this.dusmanlar) {
        if (d.ezik) { d.ezik--; continue; }
        if (!d.canli) continue;
        d.vy = Math.min((d.vy || 0) + 0.42, 8);
        d.duvar = false;
        this.hareketEt(d, d.vx, d.vy);
        const onu = d.vx > 0 ? d.x + d.g + 1 : d.x - 1;
        if (d.duvar || (d.yerde && !this.kati(onu, d.y + d.y2 + 2))) d.vx = -d.vx;
        if (d.y > Y + 50) d.canli = false;
        if (o.x < d.x + d.g && o.x + o.g > d.x && o.y < d.y + d.y2 && o.y + o.y2 > d.y) {
          if (o.vy > 0 && o.y + o.y2 - d.y < 8) {
            d.canli = false; d.ezik = 20; o.vy = -5; this.altin += 2;
            Ses.efekt("ezdi");
            this.parcacik(d.x + 7, d.y - 4, "+2", "#ffffff");
          } else { this.bitir("yandi"); return; }
        }
      }

      this.parcaciklar.forEach((p) => { p.y -= 0.6; p.omur--; });
      this.parcaciklar = this.parcaciklar.filter((p) => p.omur > 0);

      if (o.y > Y + 20) { this.bitir("yandi"); return; }
      this.kamera = Math.max(0, Math.min(o.x - G / 2 + 20, this.harita[0].length * T - G));
    },

    // ----- cizim yardimcilari -----
    cizKahraman(o) {
      // "Pitir": turuncu, tombul, kocaman gozlu bir hamster
      const yuruyor = o.vx !== 0 && o.yerde;
      const ziplama = !o.yerde;
      const sallanma = yuruyor ? Math.sin(o.adim * 2) * 1.2 : 0;
      const cx = o.x + o.g / 2, alt = o.y + o.y2;
      const gen = ziplama ? 14 : 16, yuk = ziplama ? 17 : 15;
      const ust = alt - yuk - 1 + sallanma * 0.4;
      ctx.save();
      // kuyruk
      ctx.fillStyle = "#e07a1f";
      ctx.beginPath(); ctx.arc(cx - o.bakis * 8, alt - 6, 2.5, 0, Math.PI * 2); ctx.fill();
      // ayaklar
      ctx.fillStyle = "#b85c12";
      const ad = yuruyor ? Math.sin(o.adim * 2) * 2.5 : 0;
      ctx.fillRect(cx - 5 + ad, alt - 2, 4, 3);
      ctx.fillRect(cx + 1 - ad, alt - 2, 4, 3);
      // kulaklar
      ctx.fillStyle = "#f28c28";
      ctx.beginPath(); ctx.arc(cx - 5, ust + 2, 3, 0, Math.PI * 2); ctx.arc(cx + 5, ust + 2, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffb3c7";
      ctx.beginPath(); ctx.arc(cx - 5, ust + 2, 1.5, 0, Math.PI * 2); ctx.arc(cx + 5, ust + 2, 1.5, 0, Math.PI * 2); ctx.fill();
      // govde
      ctx.fillStyle = "#f28c28";
      ctx.beginPath(); ctx.ellipse(cx, ust + yuk / 2 + 1, gen / 2, yuk / 2, 0, 0, Math.PI * 2); ctx.fill();
      // karin
      ctx.fillStyle = "#ffe6c7";
      ctx.beginPath(); ctx.ellipse(cx + o.bakis * 1.5, ust + yuk / 2 + 4, gen / 3.2, yuk / 3.4, 0, 0, Math.PI * 2); ctx.fill();
      // gozler
      const gx = cx + o.bakis * 2.5;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(gx - 3, ust + 6, 2.6, 0, Math.PI * 2); ctx.arc(gx + 3, ust + 6, 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1b1b3a";
      ctx.beginPath(); ctx.arc(gx - 3 + o.bakis, ust + 6.5, 1.4, 0, Math.PI * 2); ctx.arc(gx + 3 + o.bakis, ust + 6.5, 1.4, 0, Math.PI * 2); ctx.fill();
      // yanaklar ve agiz
      ctx.fillStyle = "#ff7aa8";
      ctx.fillRect(gx - 6, ust + 9, 2, 1.5); ctx.fillRect(gx + 4, ust + 9, 2, 1.5);
      ctx.strokeStyle = "#7a3a00"; ctx.lineWidth = 1;
      ctx.beginPath();
      if (ziplama) ctx.arc(gx, ust + 10.5, 1.5, 0, Math.PI * 2);
      else ctx.arc(gx, ust + 9.5, 1.8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.restore();
    },

    cizDusman(d) {
      // Somurtkan jole (rengi bolume gore degisir)
      const [renk, parlak, kas] = this.tema.dusman;
      const titresim = Math.sin(this.zaman * 0.25 + d.x) * 1.2;
      const cx = d.x + d.g / 2, alt = d.y + d.y2;
      if (d.ezik) {
        ctx.fillStyle = renk;
        ctx.beginPath(); ctx.ellipse(cx, alt - 2, 9, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        return;
      }
      ctx.fillStyle = renk;
      ctx.beginPath(); ctx.ellipse(cx, alt - 6, 8 + titresim * 0.5, 7 - titresim * 0.5, 0, Math.PI, 0); ctx.lineTo(cx + 8, alt); ctx.lineTo(cx - 8, alt); ctx.fill();
      ctx.fillStyle = parlak;
      ctx.fillRect(cx - 5, alt - 11, 3, 2);
      ctx.fillStyle = "#fff";
      ctx.fillRect(cx - 5, alt - 8, 3, 3); ctx.fillRect(cx + 2, alt - 8, 3, 3);
      ctx.fillStyle = "#000";
      ctx.fillRect(cx - 4 + Math.sign(d.vx), alt - 7, 1.5, 2); ctx.fillRect(cx + 3 + Math.sign(d.vx), alt - 7, 1.5, 2);
      ctx.strokeStyle = kas; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx - 6, alt - 10); ctx.lineTo(cx - 2, alt - 9); ctx.moveTo(cx + 6, alt - 10); ctx.lineTo(cx + 2, alt - 9); ctx.stroke();
    },

    ciz() {
      const tema = this.harita ? this.tema : TEMALAR.cayir;
      const zaman = this.harita ? this.zaman : performance.now() / 16;
      const grad = ctx.createLinearGradient(0, 0, 0, Y);
      grad.addColorStop(0, tema.gok[0]);
      grad.addColorStop(1, tema.gok[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, G, Y);
      if (tema.gunes) {
        ctx.fillStyle = tema.gunes;
        ctx.beginPath(); ctx.arc(270, 40, 18, 0, Math.PI * 2); ctx.fill();
      }
      // uzak tepeler (paralaks)
      const kam = this.kamera || 0;
      if (tema.tepeler) {
        ctx.fillStyle = tema.tepeler[0];
        for (let i = -1; i < 6; i++) {
          const x = i * 140 - (kam * 0.2) % 140;
          ctx.beginPath(); ctx.ellipse(x + 70, Y - 26, 80, 46, 0, Math.PI, 0); ctx.fill();
        }
        ctx.fillStyle = tema.tepeler[1];
        for (let i = -1; i < 7; i++) {
          const x = i * 110 - (kam * 0.35) % 110;
          ctx.beginPath(); ctx.ellipse(x + 30, Y - 26, 46, 30, 0, Math.PI, 0); ctx.fill();
        }
      }
      // bulutlar
      if (tema.bulut) {
        ctx.fillStyle = tema.bulut;
        for (let i = -1; i < 5; i++) {
          const x = i * 150 - (kam * 0.1 + zaman * 0.15) % 150, y = 30 + (i % 2) * 22;
          ctx.beginPath();
          ctx.arc(x + 20, y, 9, 0, Math.PI * 2); ctx.arc(x + 32, y - 5, 12, 0, Math.PI * 2); ctx.arc(x + 46, y, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      kuslariCiz(tema.kus, kam, zaman);
      if (!this.harita) {
        kaplama("🐹 ZIPZIP", "Başlamak için tıkla ya da SPACE", "Pıtır'la maceraya hazır mısın?");
        // Pitir baslangic ekraninda zipliyor
        const z = Math.abs(Math.sin(performance.now() / 250)) * 10;
        this.cizKahraman({ x: G / 2 - 6, y: 186 - z, g: 12, y2: 14, vx: 0, yerde: z < 2, bakis: 1, adim: 0 });
        yaziOrtala("Merhaba, ben Pıtır!", 176 - z, 11, "#ffe6c7");
        if (aktifOyun === this && this.durum === "bekliyor") requestAnimationFrame(() => { if (aktifOyun === this && !this.harita) this.ciz(); });
        skorYazi.textContent = "Ok tuşları / WASD ile yürü, SPACE ile zıpla";
        return;
      }
      ctx.save();
      ctx.translate(-Math.round(kam), 0);
      const bas = Math.floor(kam / T), son = bas + G / T + 2;
      // calilar ve cicekler
      for (const s of this.susler) {
        if (s.x < kam - 30 || s.x > kam + G + 30) continue;
        if (s.tur === "kristal") {
          ctx.fillStyle = s.renk;
          ctx.beginPath(); ctx.moveTo(s.x, 208); ctx.lineTo(s.x + 3, 196); ctx.lineTo(s.x + 6, 208); ctx.fill();
          ctx.beginPath(); ctx.moveTo(s.x + 5, 208); ctx.lineTo(s.x + 9, 200); ctx.lineTo(s.x + 12, 208); ctx.fill();
          ctx.fillStyle = "#ffffff88"; ctx.fillRect(s.x + 2, 200, 1, 5);
        } else if (s.tur === "mantar") {
          ctx.fillStyle = "#e8dcc8"; ctx.fillRect(s.x + 2, 202, 3, 6);
          ctx.fillStyle = s.renk;
          ctx.beginPath(); ctx.ellipse(s.x + 3.5, 202, 6, 4, 0, Math.PI, 0); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.fillRect(s.x + 1, 199, 2, 1.5); ctx.fillRect(s.x + 5, 200, 1.5, 1.5);
        } else if (s.tur === "cali") {
          ctx.fillStyle = "#3fb54a";
          ctx.beginPath(); ctx.arc(s.x, 206, 8, 0, Math.PI * 2); ctx.arc(s.x + 9, 203, 10, 0, Math.PI * 2); ctx.arc(s.x + 19, 206, 8, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = "#2f8f3a"; ctx.fillRect(s.x, 200, 1.5, 8);
          ctx.fillStyle = s.renk;
          ctx.beginPath(); ctx.arc(s.x + 1, 199, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#ffd23b"; ctx.fillRect(s.x, 198, 2, 2);
        }
      }
      for (let y = 0; y < this.harita.length; y++) {
        for (let x = bas; x < son && x < this.harita[0].length; x++) {
          const c = this.harita[y][x], px = x * T, py = y * T;
          if (c === "#") {
            const ustte = !this.harita[y - 1] || this.harita[y - 1][x] !== "#";
            ctx.fillStyle = tema.toprak[0];
            ctx.fillRect(px, py, T, T);
            ctx.fillStyle = tema.toprak[1];
            ctx.fillRect(px + ((x * 5) % 10), py + 8 + ((x * 3) % 5), 3, 2);
            if (y === 0) {
              // magara tavanindan sarkan sarkitlar
              if (x % 3 === 0) {
                const boy = 6 + ((x * 7) % 9);
                ctx.fillStyle = tema.toprak[0];
                ctx.beginPath(); ctx.moveTo(px + 2, py + T); ctx.lineTo(px + 8, py + T + boy); ctx.lineTo(px + 14, py + T); ctx.fill();
              }
            } else if (ustte) {
              ctx.fillStyle = tema.cim[0];
              ctx.fillRect(px, py, T, 5);
              ctx.fillStyle = tema.cim[1];
              ctx.fillRect(px, py + 5, T, 2);
              ctx.fillStyle = tema.cim[2];
              ctx.fillRect(px + 2, py + 1, 3, 1);
            }
          } else if (c === "B" && !tema.blok) {
            // pamuk gibi bulut platformlar
            ctx.fillStyle = "#ffffff";
            ctx.beginPath(); ctx.arc(px + 4, py + 7, 5, 0, Math.PI * 2); ctx.arc(px + 12, py + 6, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(px, py + 7, T, 6);
            ctx.fillStyle = "#cfe6ff";
            ctx.fillRect(px, py + 11, T, 2);
          } else if (c === "B") {
            // seker renkli bloklar (magarada kristal renkli)
            ctx.fillStyle = tema.blok[x % 2];
            ctx.fillRect(px, py, T, T);
            ctx.fillStyle = "#ffffff99";
            ctx.fillRect(px + 2, py + 2, T - 4, 2);
            ctx.fillStyle = "#00000022";
            ctx.fillRect(px, py + T - 3, T, 3);
            ctx.fillStyle = "#ffffffcc";
            ctx.beginPath(); ctx.arc(px + 8, py + 9, 2, 0, Math.PI * 2); ctx.fill();
          } else if (c === "o") {
            // donen altin
            const gen = Math.abs(Math.cos(this.zaman * 0.08 + x)) * 5 + 1;
            ctx.fillStyle = "#e0a800";
            ctx.beginPath(); ctx.ellipse(px + 8, py + 8, gen, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#ffd23b";
            ctx.beginPath(); ctx.ellipse(px + 8, py + 8, Math.max(gen - 1.5, 0.5), 4.5, 0, 0, Math.PI * 2); ctx.fill();
          } else if (c === "F") {
            ctx.fillStyle = "#666";
            ctx.fillRect(px + 7, py - 6 * T + 16, 2, 6 * T);
            ctx.fillStyle = "#ffd23b";
            ctx.beginPath(); ctx.arc(px + 8, py - 6 * T + 15, 3, 0, Math.PI * 2); ctx.fill();
            const dalga = Math.sin(this.zaman * 0.15) * 2;
            ctx.fillStyle = "#ff3bd1";
            ctx.beginPath();
            ctx.moveTo(px + 9, py - 6 * T + 18);
            ctx.lineTo(px + 30, py - 6 * T + 25 + dalga);
            ctx.lineTo(px + 9, py - 6 * T + 32);
            ctx.fill();
          }
        }
      }
      for (const d of this.dusmanlar) if (d.canli || d.ezik) this.cizDusman(d);
      this.cizKahraman(this.oyuncu);
      // +1 yazilari
      ctx.font = "bold 10px 'Courier New', monospace";
      for (const p of this.parcaciklar) {
        ctx.globalAlpha = p.omur / 40;
        ctx.fillStyle = "#000"; ctx.fillText(p.metin, p.x - 5, p.y + 1);
        ctx.fillStyle = p.renk; ctx.fillText(p.metin, p.x - 6, p.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // ust bilgi
      ctx.fillStyle = "#00000055";
      ctx.fillRect(6, 6, 74, 18);
      ctx.fillStyle = "#ffd23b";
      ctx.beginPath(); ctx.arc(16, 15, 5, 0, Math.PI * 2); ctx.fill();
      ctx.font = "bold 12px 'Courier New', monospace";
      ctx.fillStyle = "#fff";
      ctx.fillText("x " + this.altin, 26, 19);

      const bolum = BOLUMLER[this.bolum];
      const sira = "Bölüm " + (this.bolum + 1) + "/" + BOLUMLER.length;
      ctx.fillStyle = "#00000055";
      ctx.fillRect(G - 92, 6, 86, 18);
      ctx.fillStyle = "#fff";
      ctx.fillText(sira, G - 86, 19);
      // bolum basinda adini goster
      if (this.durum === "oynuyor" && this.zaman < 110) yaziOrtala(sira + ": " + bolum.ad, 52, 14, "#ffe14d");

      skorYazi.textContent = sira + " · " + bolum.ad + " · Altın: " + this.altin;
      if (this.durum === "yandi") kaplama("AH, OLAMAZ!", sira + " baştan · SPACE", "Pıtır pes etmez, bir daha!");
      if (this.durum === "bolumBitti") {
        kaplama("🏁 BÖLÜM " + (this.bolum + 1) + " TAMAM!", "Sıradaki: " + BOLUMLER[this.bolum + 1].ad + " · SPACE", this.altin + " altın topladın");
      }
      if (this.durum === "kazandi") {
        const rekor = guvenliOku("zipzip_rekor", "0");
        kaplama("🏆 PITIR EVE DÖNDÜ!", this.altin + " altın · Rekor: " + rekor + " · SPACE", this.yeniRekor ? "YENİ REKOR! 🎉" : "3 bölümü de bitirdin! 🧡");
      }
    },

    tus(k) {
      if (this.durum !== "oynuyor" && (k === " " || k === "Enter")) this.baslat();
    },

    dur() {
      cancelAnimationFrame(this.dongu);
      Ses.muzikDurdur();
      if (this.durum === "oynuyor") { this.durum = "bekliyor"; this.harita = null; }
    },
  };

  // ======================= Ortak kontroller =======================
  const OYUNLAR = { yilan, zipzip };

  function oyunSec(ad) {
    if (aktifOyun) aktifOyun.dur();
    aktifOyun = OYUNLAR[ad];
    sekmeler.forEach((s) => s.classList.toggle("secili", s.dataset.oyun === ad));
    document.getElementById("dokunmatik").classList.toggle("zipzip-modu", ad === "zipzip");
    aktifOyun.ciz();
  }

  sekmeler.forEach((s) => s.addEventListener("click", () => { oyunSec(s.dataset.oyun); tuval.focus(); }));

  tuval.addEventListener("click", () => {
    tuval.focus();
    Ses.hazirla();
    if (aktifOyun.durum !== "oynuyor") aktifOyun.baslat();
  });

  tuval.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    Ses.hazirla();
    tuslar[e.key] = true;
    aktifOyun.tus(e.key);
  });
  tuval.addEventListener("keyup", (e) => { tuslar[e.key] = false; });
  tuval.addEventListener("blur", () => { for (const k in tuslar) tuslar[k] = false; });

  document.querySelectorAll("[data-tus]").forEach((d) => {
    const tus = d.dataset.tus;
    const bas = (e) => {
      e.preventDefault();
      tuval.focus();
      Ses.hazirla();
      if (aktifOyun.durum !== "oynuyor") { aktifOyun.baslat(); return; }
      if (aktifOyun === yilan) yilan.tus(tus);
      else tuslar[{ ArrowLeft: "dokunSol", ArrowRight: "dokunSag", ArrowUp: "dokunZipla" }[tus]] = true;
    };
    const birak = () => { tuslar.dokunSol = tuslar.dokunSag = tuslar.dokunZipla = false; };
    d.addEventListener("pointerdown", bas);
    d.addEventListener("pointerup", birak);
    d.addEventListener("pointerleave", birak);
  });

  // MP3 calardan sarki acilirsa oyun muzigi sussun
  const calarSes = document.getElementById("calar-ses");
  if (calarSes) calarSes.addEventListener("play", () => Ses.muzikDurdur());

  oyunSec("yilan");
})();
