---
name: sarki-listesi-ekle
description: Yeni bir yıl için şarkı listesi ekler. Kullanıcı "X yılı için şarkı listesi ekle" dediğinde kullan.
---

# Şarkı listesi ekleme

1. `static/muzik.js` içindeki `SARKILAR` nesnesini aç.
2. Yeni yılı, yıllar sırasına uygun yere ekle.
3. Her şarkı `["Sanatçı", "Şarkı adı"]` şeklinde olsun. Diğer yıllar gibi 7 şarkı yaz.
4. O yılın gerçekten popüler şarkılarını seç, aralara bir Türkçe şarkı da koy. Gelecek bir yılsa inandırıcı ama uydurma şarkılar yaz.
5. `static/muzik/<yıl>/` klasörünü oluştur.
6. Testleri `pytest` ile çalıştır.