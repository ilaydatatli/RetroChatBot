// Her yil icin sol panel bilgileri:
//   olaylar    -> o yil neler oldu
//   yenilikler -> o yil cikan icatlar, urunler, bilimsel gelismeler
//   oduller    -> film: o yil vizyona girip Oscar'da En Iyi Film alan
//                 dizi: o yil Emmy'de En Iyi Drama Dizisi secilen
//                 kitap: o yil Booker Odulu'nu kazanan roman
//                 nobel: o yil Nobel Edebiyat Odulu'nu alan yazar

const OLAYLAR = {
  1990: {
    olaylar: [
      "🇩🇪 Doğu ve Batı Almanya yeniden birleşti.",
      "🕊️ Nelson Mandela 27 yıl sonra hapisten çıktı.",
      "📺 Türkiye'nin ilk özel televizyonu Star 1 yayına başladı.",
      "⚽ İtalya'daki Dünya Kupası'nı Batı Almanya kazandı.",
      "🏠 \"Evde Tek Başına\" filmi gişe rekorları kırdı.",
    ],
    yenilikler: [
      "🔭 Hubble Uzay Teleskobu uzaya fırlatıldı.",
      "🌐 Tim Berners-Lee ilk web tarayıcısını ve web sunucusunu yazdı.",
      "💻 Windows 3.0 piyasaya çıktı.",
      "🖼️ Photoshop'un ilk sürümü çıktı.",
      "🎮 Super Nintendo (Super Famicom) Japonya'da satışa çıktı.",
    ],
    oduller: {
      film: "Kurtlarla Dans",
      dizi: "L.A. Law",
      kitap: "Possession — A. S. Byatt",
      nobel: "Octavio Paz",
    },
  },
  1991: {
    olaylar: [
      "🏛️ Sovyetler Birliği dağıldı.",
      "🎸 Nirvana'nın \"Nevermind\" albümü grunge çılgınlığını başlattı.",
      "🤖 \"Terminatör 2\" görsel efektleriyle herkesi büyüledi.",
      "🌹 Disney'in \"Güzel ve Çirkin\" filmi vizyona girdi.",
    ],
    yenilikler: [
      "🌍 World Wide Web herkesin kullanımına açıldı; ilk web sitesi yayında.",
      "🐧 Linus Torvalds, Linux çekirdeğinin ilk sürümünü yayımladı.",
      "🔋 Şarj edilebilir lityum-iyon piller ilk kez satışa çıktı.",
      "🔐 PGP adlı e-posta şifreleme programı yayımlandı.",
    ],
    oduller: {
      film: "Kuzuların Sessizliği",
      dizi: "L.A. Law",
      kitap: "The Famished Road — Ben Okri",
      nobel: "Nadine Gordimer",
    },
  },
  1992: {
    olaylar: [
      "🇪🇺 Avrupa Birliği'ni kuran Maastricht Antlaşması imzalandı.",
      "🏀 Barselona Olimpiyatları'nda ABD'nin \"Rüya Takımı\" sahneye çıktı.",
      "⚽ Danimarka, son anda katıldığı EURO 92'yi kazanarak herkesi şaşırttı.",
      "🧞 Disney'in \"Aladdin\" filmi vizyona girdi.",
    ],
    yenilikler: [
      "📱 Dünyanın ilk SMS'i gönderildi: \"Merry Christmas\".",
      "🪟 Windows 3.1 çıktı.",
      "🖼️ Fotoğraflar için JPEG formatı standart oldu.",
      "🪐 Güneş sistemi dışındaki ilk gezegenler keşfedildi.",
    ],
    oduller: {
      film: "Affedilmeyen",
      dizi: "Northern Exposure",
      kitap: "İngiliz Hasta — Michael Ondaatje ve Sacred Hunger — Barry Unsworth (ortak)",
      nobel: "Derek Walcott",
    },
  },
  1993: {
    olaylar: [
      "🇪🇺 Avrupa Birliği resmen kuruldu.",
      "🇹🇷 Tansu Çiller, Türkiye'nin ilk kadın başbakanı oldu.",
      "🦖 \"Jurassic Park\" sinemalarda rekor kırdı.",
    ],
    yenilikler: [
      "🖱️ Resimli web sayfalarını gösteren Mosaic tarayıcısı çıktı.",
      "🆓 CERN, web teknolojisini herkese ücretsiz açtı.",
      "⚙️ Intel'in ilk Pentium işlemcisi piyasaya çıktı.",
      "👾 Efsanevi bilgisayar oyunu Doom çıktı.",
      "☕ İlk web kamerası bir üniversitedeki kahve makinesini yayınlamaya başladı.",
      "🎨 Ekran kartı şirketi Nvidia kuruldu.",
    ],
    oduller: {
      film: "Schindler'in Listesi",
      dizi: "Picket Fences",
      kitap: "Paddy Clarke Ha Ha Ha — Roddy Doyle",
      nobel: "Toni Morrison",
    },
  },
  1994: {
    olaylar: [
      "🚄 Manş Tüneli açıldı; İngiltere ile Fransa trenle bağlandı.",
      "🇿🇦 Nelson Mandela, Güney Afrika'nın devlet başkanı oldu.",
      "⚽ ABD'deki Dünya Kupası'nı Brezilya kazandı.",
      "🦁 \"Aslan Kral\" vizyona girdi.",
      "☕ \"Friends\" dizisi yayına başladı.",
    ],
    yenilikler: [
      "📦 Amazon, internetten kitap satan bir şirket olarak kuruldu.",
      "🧭 Netscape Navigator tarayıcısı çıktı.",
      "📒 Yahoo! bir web sitesi rehberi olarak kuruldu.",
      "🎮 İlk PlayStation Japonya'da satışa çıktı.",
      "📞 Dokunmatik ekranlı ilk \"akıllı telefon\" IBM Simon satışa çıktı.",
    ],
    oduller: {
      film: "Forrest Gump",
      dizi: "Picket Fences",
      kitap: "How Late It Was, How Late — James Kelman",
      nobel: "Kenzaburō Ōe",
    },
  },
  1995: {
    olaylar: [
      "🇹🇷 Türkiye ile Avrupa Birliği arasında Gümrük Birliği kararı alındı.",
      "🧸 \"Oyuncak Hikâyesi\", tamamen bilgisayarla yapılmış ilk uzun metraj film oldu.",
      "🪟 Windows 95'in tanıtımı dev bir kutlamaya dönüştü.",
    ],
    yenilikler: [
      "🪟 Windows 95, ünlü \"Başlat\" menüsüyle geldi.",
      "☕ JavaScript ve Java programlama dilleri ortaya çıktı.",
      "💿 DVD formatı duyuruldu.",
      "🛒 eBay kuruldu.",
      "🌐 Internet Explorer tarayıcısı çıktı.",
      "🎵 Müzik dosyaları için \".mp3\" uzantısı seçildi.",
    ],
    oduller: {
      film: "Cesur Yürek",
      dizi: "NYPD Blue",
      kitap: "The Ghost Road — Pat Barker",
      nobel: "Seamus Heaney",
    },
  },
  1996: {
    olaylar: [
      "🇹🇷 Türkiye–AB Gümrük Birliği yürürlüğe girdi.",
      "🏅 Atlanta Yaz Olimpiyatları düzenlendi.",
      "⚽ İngiltere'deki EURO 96'yı Almanya kazandı.",
      "🎤 Spice Girls'ün \"Wannabe\" şarkısı dünyayı salladı.",
      "🐑 Klonlanmış ilk memeli, koyun Dolly doğdu.",
    ],
    yenilikler: [
      "🥚 Tamagotchi Japonya'da satışa çıktı.",
      "💬 ICQ ile anlık mesajlaşma çılgınlığı başladı.",
      "📧 Ücretsiz e-posta servisi Hotmail açıldı.",
      "🎮 Nintendo 64 ve ilk Pokémon oyunları çıktı.",
      "🔌 USB bağlantı standardı tanıtıldı.",
      "✍️ Kalemle yazılan cep bilgisayarı Palm Pilot çıktı.",
    ],
    oduller: {
      film: "İngiliz Hasta",
      dizi: "ER (Acil Servis)",
      kitap: "Last Orders — Graham Swift",
      nobel: "Wisława Szymborska",
    },
  },
  1997: {
    olaylar: [
      "♟️ IBM'in Deep Blue bilgisayarı, satranç şampiyonu Kasparov'u yendi.",
      "🇭🇰 Hong Kong, İngiltere'den Çin'e devredildi.",
      "🚢 \"Titanik\" filmi vizyona girdi.",
      "📚 İlk Harry Potter kitabı yayımlandı.",
    ],
    yenilikler: [
      "🔴 Mars Pathfinder ve küçük gezgini Sojourner Mars'a indi.",
      "📶 İlk Wi-Fi standardı yayımlandı.",
      "💿 DVD oynatıcılar satışa çıktı.",
      "📮 Netflix, DVD'leri postayla kiralayan bir şirket olarak kuruldu.",
      "🔍 \"google.com\" alan adı alındı.",
    ],
    oduller: {
      film: "Titanik",
      dizi: "Law & Order",
      kitap: "Küçük Şeylerin Tanrısı — Arundhati Roy",
      nobel: "Dario Fo",
    },
  },
  1998: {
    olaylar: [
      "⚽ Fransa'daki Dünya Kupası'nı ev sahibi Fransa kazandı.",
      "🏆 \"Titanik\" 11 Oscar kazanarak rekora ortak oldu.",
      "🔍 Google bir garajda kuruldu.",
    ],
    yenilikler: [
      "🍬 Renkli, şeffaf kasalı iMac G3 tanıtıldı.",
      "🛰️ Uluslararası Uzay İstasyonu'nun ilk modülü fırlatıldı.",
      "🪟 Windows 98 çıktı.",
      "🎮 Game Boy Color satışa çıktı.",
      "💳 Sonradan PayPal olacak şirket kuruldu.",
    ],
    oduller: {
      film: "Aşık Shakespeare",
      dizi: "The Practice",
      kitap: "Amsterdam — Ian McEwan",
      nobel: "José Saramago",
    },
  },
  1999: {
    olaylar: [
      "💶 Euro, bankacılık işlemlerinde kullanılmaya başlandı.",
      "🇹🇷 Türkiye, Avrupa Birliği'ne aday ülke oldu.",
      "🌑 Türkiye'den de izlenen büyük bir tam güneş tutulması yaşandı.",
      "🕶️ \"Matrix\" filmi vizyona girdi.",
      "⏰ Herkes Y2K, yani \"2000 yılı hatası\" için endişeleniyordu.",
    ],
    yenilikler: [
      "🎵 Napster ile internetten müzik paylaşımı patladı.",
      "📶 \"Wi-Fi\" adı ilk kez kullanıldı.",
      "📟 İlk BlackBerry cihazı çıktı.",
      "🎧 Bluetooth'un ilk sürümü yayımlandı.",
    ],
    oduller: {
      film: "Amerikan Güzeli",
      dizi: "The Practice",
      kitap: "Utanç — J. M. Coetzee",
      nobel: "Günter Grass",
    },
  },
  2000: {
    olaylar: [
      "🎆 Y2K korkusu boşa çıktı, bilgisayarlar çalışmaya devam etti.",
      "🏆 Galatasaray UEFA Kupası'nı ve ardından Süper Kupa'yı kazandı.",
      "🏅 Sidney Yaz Olimpiyatları düzenlendi.",
      "⚽ EURO 2000'i Fransa kazandı.",
    ],
    yenilikler: [
      "🛰️ Uluslararası Uzay İstasyonu'na ilk mürettebat yerleşti.",
      "🎮 PlayStation 2 piyasaya çıktı.",
      "💾 İlk USB bellekler satışa çıktı.",
      "📷 Kameralı ilk cep telefonu Japonya'da satışa çıktı.",
    ],
    oduller: {
      film: "Gladyatör",
      dizi: "The West Wing",
      kitap: "Kör Suikastçı — Margaret Atwood",
      nobel: "Gao Xingjian",
    },
  },
  2001: {
    olaylar: [
      "⚡ İlk Harry Potter filmi vizyona girdi.",
      "💍 \"Yüzüklerin Efendisi\" üçlemesinin ilk filmi geldi.",
      "🟢 \"Shrek\" vizyona girdi.",
    ],
    yenilikler: [
      "📖 Wikipedia kuruldu.",
      "🎧 İlk iPod tanıtıldı: \"cebinde 1000 şarkı\".",
      "🎵 iTunes müzik programı çıktı.",
      "🪟 Windows XP piyasaya çıktı.",
      "🎮 Xbox ve GameCube oyun konsolları çıktı.",
    ],
    oduller: {
      film: "Akıl Oyunları",
      dizi: "The West Wing",
      kitap: "True History of the Kelly Gang — Peter Carey",
      nobel: "V. S. Naipaul",
    },
  },
  2002: {
    olaylar: [
      "💶 Euro banknot ve madeni paraları tedavüle girdi.",
      "⚽ Türkiye, Dünya Kupası'nı üçüncü olarak tamamladı.",
      "🏆 Dünya Kupası'nı Brezilya kazandı.",
      "🕷️ \"Örümcek Adam\" filmi vizyona girdi.",
    ],
    yenilikler: [
      "🧹 Robot süpürge Roomba satışa çıktı.",
      "💼 İş ağı LinkedIn kuruldu.",
      "📸 Kameralı cep telefonları yaygınlaşmaya başladı.",
    ],
    oduller: {
      film: "Chicago",
      dizi: "The West Wing",
      kitap: "Pi'nin Yaşamı — Yann Martel",
      nobel: "Imre Kertész",
    },
  },
  2003: {
    olaylar: [
      "🎤 Sertab Erener \"Everyway That I Can\" ile Eurovision'u kazandı.",
      "✈️ Süpersonik yolcu uçağı Concorde son uçuşunu yaptı.",
      "🐠 \"Kayıp Balık Nemo\" vizyona girdi.",
    ],
    yenilikler: [
      "🧬 İnsan Genom Projesi tamamlandı.",
      "📞 Skype kuruldu; internetten ücretsiz konuşmalar başladı.",
      "🎶 iTunes Store açıldı; şarkılar tek tek satın alınabildi.",
      "👥 MySpace kuruldu.",
      "🚗 Elektrikli araç şirketi Tesla kuruldu.",
    ],
    oduller: {
      film: "Yüzüklerin Efendisi: Kralın Dönüşü",
      dizi: "The West Wing",
      kitap: "Vernon God Little — DBC Pierre",
      nobel: "J. M. Coetzee",
    },
  },
  2004: {
    olaylar: [
      "🎤 Eurovision Şarkı Yarışması İstanbul'da düzenlendi.",
      "🏅 Atina Yaz Olimpiyatları düzenlendi.",
      "⚽ Yunanistan EURO 2004'ü kazanarak herkesi şaşırttı.",
    ],
    yenilikler: [
      "👥 Facebook kuruldu.",
      "📧 Gmail, o zamana göre devasa 1 GB alanla tanıtıldı.",
      "🔴 Spirit ve Opportunity gezginleri Mars'a indi.",
      "🦊 Firefox tarayıcısının 1.0 sürümü çıktı.",
      "🎮 Nintendo DS ve World of Warcraft çıktı.",
    ],
    oduller: {
      film: "Milyon Dolarlık Bebek",
      dizi: "The Sopranos",
      kitap: "The Line of Beauty — Alan Hollinghurst",
      nobel: "Elfriede Jelinek",
    },
  },
  2005: {
    olaylar: [
      "💵 Türk lirasından altı sıfır atıldı; Yeni Türk Lirası geldi.",
      "⚽ İstanbul'daki Şampiyonlar Ligi finali tarihe geçti: Liverpool 0-3'ten döndü.",
      "🇹🇷 Türkiye ile AB arasında üyelik müzakereleri başladı.",
    ],
    yenilikler: [
      "▶️ YouTube kuruldu; ilk video bir hayvanat bahçesinde çekildi.",
      "🗺️ Google Maps yayına girdi.",
      "🪐 Huygens aracı Satürn'ün uydusu Titan'a indi.",
      "🎮 Xbox 360 çıktı.",
      "👽 Reddit kuruldu.",
    ],
    oduller: {
      film: "Çarpışma",
      dizi: "Lost",
      kitap: "The Sea — John Banville",
      nobel: "Harold Pinter",
    },
  },
  2006: {
    olaylar: [
      "📚 Orhan Pamuk Nobel Edebiyat Ödülü'nü kazandı.",
      "🪐 Plüton artık gezegen değil, \"cüce gezegen\" sayıldı.",
      "⚽ Almanya'daki Dünya Kupası'nı İtalya kazandı.",
    ],
    yenilikler: [
      "🐦 Twitter kuruldu.",
      "🎮 Hareket algılayan Nintendo Wii ve PlayStation 3 çıktı.",
      "▶️ Google, YouTube'u satın aldı.",
      "👥 Facebook herkese açıldı.",
    ],
    oduller: {
      film: "Köstebek",
      dizi: "24",
      kitap: "The Inheritance of Loss — Kiran Desai",
      nobel: "Orhan Pamuk",
    },
  },
  2007: {
    olaylar: [
      "📚 Son Harry Potter kitabı \"Ölüm Yadigârları\" çıktı.",
      "🎬 Netflix internetten film izleme hizmetini başlattı.",
    ],
    yenilikler: [
      "📱 İlk iPhone tanıtıldı.",
      "📖 E-kitap okuyucu Kindle çıktı.",
      "🤖 Android işletim sistemi duyuruldu.",
      "📝 Tumblr kuruldu.",
    ],
    oduller: {
      film: "İhtiyarlara Yer Yok",
      dizi: "The Sopranos",
      kitap: "The Gathering — Anne Enright",
      nobel: "Doris Lessing",
    },
  },
  2008: {
    olaylar: [
      "⚽ Türkiye EURO 2008'de yarı finale çıktı.",
      "🏆 EURO 2008'i İspanya kazandı.",
      "🏅 Pekin Yaz Olimpiyatları düzenlendi.",
      "📉 Dünya büyük bir ekonomik krize girdi.",
    ],
    yenilikler: [
      "🤖 İlk Android telefon satışa çıktı.",
      "🛍️ App Store açıldı; \"uygulama\" kelimesi hayatımıza girdi.",
      "🌐 Google Chrome tarayıcısı çıktı.",
      "🎵 Spotify ve Airbnb kuruldu.",
      "₿ Bitcoin'i anlatan makale yayımlandı.",
      "⚛️ Büyük Hadron Çarpıştırıcısı çalışmaya başladı.",
    ],
    oduller: {
      film: "Milyoner",
      dizi: "Mad Men",
      kitap: "Beyaz Kaplan — Aravind Adiga",
      nobel: "J. M. G. Le Clézio",
    },
  },
  2009: {
    olaylar: [
      "🎬 \"Avatar\" 3D gözlükleri herkese taktırdı.",
    ],
    yenilikler: [
      "₿ Bitcoin ağı çalışmaya başladı.",
      "💬 WhatsApp kuruldu.",
      "⛏️ Minecraft'ın ilk sürümü çıktı.",
      "🚕 Uber kuruldu.",
      "🪟 Windows 7 çıktı.",
      "🔭 Gezegen avcısı Kepler Uzay Teleskobu fırlatıldı.",
    ],
    oduller: {
      film: "Ölümcül Tuzak",
      dizi: "Mad Men",
      kitap: "Wolf Hall — Hilary Mantel",
      nobel: "Herta Müller",
    },
  },
  2010: {
    olaylar: [
      "🏛️ İstanbul, Avrupa Kültür Başkenti oldu.",
      "⚽ Dünya Kupası ilk kez Afrika'da düzenlendi; İspanya kazandı.",
      "🌀 \"Başlangıç\" (Inception) filmi vizyona girdi.",
    ],
    yenilikler: [
      "📲 İlk iPad tanıtıldı.",
      "📸 Instagram kuruldu.",
      "📌 Pinterest kuruldu.",
      "🕺 Vücut hareketini algılayan Kinect çıktı.",
    ],
    oduller: {
      film: "Zoraki Kral",
      dizi: "Mad Men",
      kitap: "The Finkler Question — Howard Jacobson",
      nobel: "Mario Vargas Llosa",
    },
  },
  2011: {
    olaylar: [
      "🌍 Dünya nüfusu 7 milyarı geçti.",
      "⚡ Son Harry Potter filmi vizyona girdi.",
      "🐉 \"Game of Thrones\" dizisi başladı.",
    ],
    yenilikler: [
      "🗣️ Sesli asistan Siri tanıtıldı.",
      "👻 Snapchat kuruldu.",
      "⛏️ Minecraft'ın tam sürümü çıktı.",
      "🎮 Nintendo 3DS çıktı.",
    ],
    oduller: {
      film: "The Artist",
      dizi: "Mad Men",
      kitap: "Bir Son Duygusu — Julian Barnes",
      nobel: "Tomas Tranströmer",
    },
  },
  2012: {
    olaylar: [
      "🏅 Londra Yaz Olimpiyatları düzenlendi.",
      "🪂 Felix Baumgartner stratosferden atlayıp ses hızını aştı.",
      "🐴 \"Gangnam Style\" YouTube'da 1 milyar izlenmeyi geçen ilk video oldu.",
    ],
    yenilikler: [
      "⚛️ Higgs bozonu (\"Tanrı parçacığı\") keşfedildi.",
      "🔴 Curiosity gezgini Mars'a indi.",
      "🥽 Sanal gerçeklik gözlüğü Oculus Rift tanıtıldı.",
      "❤️ Tinder kuruldu.",
      "🪟 Windows 8 çıktı.",
    ],
    oduller: {
      film: "Operasyon: Argo",
      dizi: "Homeland",
      kitap: "Bring Up the Bodies — Hilary Mantel",
      nobel: "Mo Yan",
    },
  },
  2013: {
    olaylar: [
      "🚇 Marmaray açıldı; Asya ile Avrupa denizin altından bağlandı.",
      "⛪ Papa Franciscus seçildi.",
      "❄️ \"Karlar Ülkesi\" vizyona girdi.",
    ],
    yenilikler: [
      "🚀 Voyager 1'in yıldızlar arası uzaya geçtiği açıklandı.",
      "🎮 PlayStation 4 ve Xbox One çıktı.",
      "👓 Akıllı gözlük Google Glass ilk kullanıcılara verildi.",
    ],
    oduller: {
      film: "12 Yıllık Esaret",
      dizi: "Breaking Bad",
      kitap: "The Luminaries — Eleanor Catton",
      nobel: "Alice Munro",
    },
  },
  2014: {
    olaylar: [
      "⚽ Brezilya'daki Dünya Kupası'nı Almanya kazandı.",
      "🧊 Buz kovası meydan okuması tüm dünyayı sardı.",
    ],
    yenilikler: [
      "☄️ Philae aracı bir kuyruklu yıldızın yüzeyine indi.",
      "⌚ Apple Watch duyuruldu.",
      "🔊 Sesli asistan Alexa ve akıllı hoparlör Echo tanıtıldı.",
      "💬 Facebook, WhatsApp'ı satın aldı.",
    ],
    oduller: {
      film: "Birdman",
      dizi: "Breaking Bad",
      kitap: "The Narrow Road to the Deep North — Richard Flanagan",
      nobel: "Patrick Modiano",
    },
  },
  2015: {
    olaylar: [
      "🌍 Paris İklim Anlaşması kabul edildi.",
    ],
    yenilikler: [
      "🪐 New Horizons, Plüton'un ilk net fotoğraflarını çekti.",
      "🚀 SpaceX, bir roketi ilk kez dikey olarak geri indirdi.",
      "🌌 Kütleçekim dalgaları ilk kez algılandı.",
      "🪟 Windows 10 çıktı.",
      "🤖 Yapay zekâ şirketi OpenAI kuruldu.",
    ],
    oduller: {
      film: "Spotlight",
      dizi: "Game of Thrones",
      kitap: "A Brief History of Seven Killings — Marlon James",
      nobel: "Svetlana Aleksiyeviç",
    },
  },
  2016: {
    olaylar: [
      "🏅 Rio Yaz Olimpiyatları düzenlendi.",
      "⚽ EURO 2016'yı Portekiz kazandı.",
      "🔦 \"Stranger Things\" dizisi başladı.",
      "🎸 Bob Dylan, Nobel Edebiyat Ödülü'nü alan ilk şarkıcı oldu.",
    ],
    yenilikler: [
      "📍 Pokémon GO ile herkes sokaklarda yaratık avladı.",
      "🤖 Yapay zekâ AlphaGo, Go şampiyonu Lee Sedol'u yendi.",
      "🎧 Kablosuz kulaklık AirPods tanıtıldı.",
      "🎵 TikTok'un ilk hâli Çin'de çıktı.",
      "🪐 Juno aracı Jüpiter'in yörüngesine girdi.",
    ],
    oduller: {
      film: "Ay Işığı",
      dizi: "Game of Thrones",
      kitap: "The Sellout — Paul Beatty",
      nobel: "Bob Dylan",
    },
  },
  2017: {
    olaylar: [
      "🌑 ABD'yi baştan sona geçen bir tam güneş tutulması izlendi.",
    ],
    yenilikler: [
      "☄️ Güneş sistemi dışından gelen ilk cisim ʻOumuamua keşfedildi.",
      "🎮 Nintendo Switch çıktı.",
      "🙂 Telefonlar yüz tanımayla açılmaya başladı.",
      "🧠 Bugünkü yapay zekâların temeli olan \"Transformer\" makalesi yayımlandı.",
      "🪐 Cassini aracı, görevini Satürn'e dalarak bitirdi.",
    ],
    oduller: {
      film: "Suyun Sesi",
      dizi: "The Handmaid's Tale",
      kitap: "Lincoln in the Bardo — George Saunders",
      nobel: "Kazuo Ishiguro",
    },
  },
  2018: {
    olaylar: [
      "⚽ Rusya'daki Dünya Kupası'nı Fransa kazandı.",
      "🎮 Fortnite çılgınlığı okulları sardı.",
    ],
    yenilikler: [
      "🚀 Falcon Heavy roketi, bir otomobili uzaya gönderdi.",
      "☀️ Güneş'e en çok yaklaşacak araç Parker Solar Probe fırlatıldı.",
      "🔴 InSight aracı Mars'a indi.",
    ],
    oduller: {
      film: "Yeşil Rehber",
      dizi: "Game of Thrones",
      kitap: "Milkman — Anna Burns",
      nobel: "Olga Tokarczuk",
    },
  },
  2019: {
    olaylar: [
      "🦸 \"Yenilmezler: Son Oyun\" gişe rekorları kırdı.",
    ],
    yenilikler: [
      "🕳️ Bir kara deliğin ilk fotoğrafı yayımlandı.",
      "🌕 Çin'in Chang'e 4 aracı Ay'ın uzak yüzüne ilk kez indi.",
      "📱 İlk katlanabilir telefonlar çıktı.",
      "⚛️ Google, kuantum bilgisayarla bir ilk başardığını açıkladı.",
      "📶 5G bağlantı yaygınlaşmaya başladı.",
    ],
    oduller: {
      film: "Parazit",
      dizi: "Game of Thrones",
      kitap: "The Testaments — Margaret Atwood ve Girl, Woman, Other — Bernardine Evaristo (ortak)",
      nobel: "Peter Handke",
    },
  },
  2020: {
    olaylar: [
      "😷 COVID-19 pandemisi tüm dünyayı evlere kapattı.",
      "💻 Toplantılar, dersler, doğum günleri bile görüntülü yapılır oldu.",
      "🏅 Tokyo Olimpiyatları bir yıl ertelendi.",
    ],
    yenilikler: [
      "💉 İlk mRNA aşıları onaylandı.",
      "🚀 SpaceX ilk kez astronotları uzay istasyonuna taşıdı.",
      "🎮 PlayStation 5 ve Xbox Series X çıktı.",
      "🧬 Yapay zekâ AlphaFold, proteinlerin şeklini çözmede çığır açtı.",
    ],
    oduller: {
      film: "Göçebeler Diyarı",
      dizi: "Succession",
      kitap: "Shuggie Bain — Douglas Stuart",
      nobel: "Louise Glück",
    },
  },
  2021: {
    olaylar: [
      "🏅 Tokyo Olimpiyatları seyircisiz düzenlendi.",
      "⚽ EURO 2020'yi İtalya kazandı.",
      "🦑 \"Squid Game\" dizisi izlenme rekorları kırdı.",
    ],
    yenilikler: [
      "🔴 Perseverance gezgini Mars'a indi.",
      "🚁 Ingenuity, Mars'ta uçan ilk helikopter oldu.",
      "🔭 James Webb Uzay Teleskobu fırlatıldı.",
    ],
    oduller: {
      film: "CODA",
      dizi: "The Crown",
      kitap: "The Promise — Damon Galgut",
      nobel: "Abdulrazak Gurnah",
    },
  },
  2022: {
    olaylar: [
      "⚽ Katar'daki Dünya Kupası'nı Arjantin kazandı.",
      "🌍 Dünya nüfusu 8 milyara ulaştı.",
    ],
    yenilikler: [
      "🤖 ChatGPT çıktı; yapay zekâ ile sohbet etmek sıradanlaştı.",
      "🌌 James Webb Uzay Teleskobu ilk renkli görüntülerini paylaştı.",
      "☄️ DART aracı bir asteroide çarpıp yörüngesini değiştirdi.",
      "🌕 Artemis I aracı Ay'ın etrafını dolaşıp geri döndü.",
    ],
    oduller: {
      film: "Her Şey Her Yerde Aynı Anda",
      dizi: "Succession",
      kitap: "The Seven Moons of Maali Almeida — Shehan Karunatilaka",
      nobel: "Annie Ernaux",
    },
  },
  2023: {
    olaylar: [
      "🇹🇷 Türkiye Cumhuriyeti 100. yılını kutladı.",
      "🎀 \"Barbie\" ve \"Oppenheimer\" aynı gün vizyona girdi: \"Barbenheimer\".",
    ],
    yenilikler: [
      "🌕 Hindistan'ın Chandrayaan-3 aracı Ay'ın güney kutbuna yakın bir yere indi.",
      "🚗 Yerli otomobil Togg'un teslimatları başladı.",
      "🥽 Apple Vision Pro gözlüğü tanıtıldı.",
      "🤖 Yapay zekâ asistanları okullara ve iş yerlerine hızla yayıldı.",
    ],
    oduller: {
      film: "Oppenheimer",
      dizi: "Succession",
      kitap: "Prophet Song — Paul Lynch",
      nobel: "Jon Fosse",
    },
  },
  2024: {
    olaylar: [
      "🇹🇷 Alper Gezeravcı, uzaya giden ilk Türk astronot oldu.",
      "🏅 Paris Yaz Olimpiyatları düzenlendi.",
      "⚽ Türkiye EURO 2024'te çeyrek finale çıktı; turnuvayı İspanya kazandı.",
      "🌑 Kuzey Amerika'da büyük bir tam güneş tutulması izlendi.",
    ],
    yenilikler: [
      "🌕 Japonya'nın SLIM aracı Ay'a indi.",
      "🚀 SpaceX, dev roketini dönüşte fırlatma kulesinin kollarıyla yakaladı.",
      "🧬 Protein yapısını çözen yapay zekâya Nobel Kimya Ödülü verildi.",
    ],
    oduller: {
      film: "Anora",
      dizi: "Shōgun",
      kitap: "Orbital — Samantha Harvey",
      nobel: "Han Kang",
    },
  },
  2025: {
    olaylar: [
      "⛪ Papa XIV. Leo seçildi.",
    ],
    yenilikler: [
      "🌕 Özel bir şirketin aracı (Blue Ghost) Ay'a başarıyla indi.",
      "🔭 Vera Rubin Gözlemevi ilk görüntülerini paylaştı.",
    ],
    oduller: {
      dizi: "The Pitt",
      nobel: "László Krasznahorkai",
    },
  },
  2026: {
    olaylar: [
      "⛷️ Milano-Cortina Kış Olimpiyatları düzenlendi.",
      "⚽ Dünya Kupası ilk kez 48 takımla ABD, Kanada ve Meksika'da oynandı.",
      "🕰️ Şu an buradasın!",
    ],
    yenilikler: [],
    oduller: {},
  },
  2035: {
    olaylar: [
      "🔮 Bunlar NovaBot'un dünyası, yani tamamen hayal ürünü:",
      "🌙 Ay'a turistik geziler düzenleniyor.",
      "🏙️ Şehirlerin üstünde hava taksileri uçuyor.",
    ],
    yenilikler: [
      "🕶️ Telefonların yerini akıllı gözlükler aldı.",
      "🚗 Sürücüsüz taksiler sıradan oldu.",
      "🤖 Ev robotları bulaşık yıkayıp çamaşır katlıyor.",
    ],
    oduller: {},
  },
};
