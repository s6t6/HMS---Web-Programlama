const db = require('./db');


// Eski. seed.js kullanın.

function seedDatabase() {
  const insertPoliklinik = db.prepare('INSERT INTO poliklinik (ad) VALUES (?)');
  const insertDoktor = db.prepare(`INSERT INTO doktor (ad, soyad, unvan, k_adi, sifre, poliklinik_id) 
                                   VALUES (?, ?, ?, ?, ?, ?)`);
  const insertHasta = db.prepare('INSERT INTO hasta (ad, soyad, yas) VALUES (?, ?, ?)');
  const insertRandevu = db.prepare(`INSERT INTO randevu (doktor_id, datetime, hasta_id, durum) 
                                    VALUES (?, ?, ?, ?)`);

  const poliklinikler = ['Kardiyoloji', 'Dermatoloji', 'Nöroloji'];
  const doktorlar = [
    { ad: 'Ahmet', soyad: 'Yılmaz', unvan: 'Prof. Dr.', k_adi: 'ahmety', sifre: 'pass123', poliklinik: 1 },
    { ad: 'Ayşe', soyad: 'Demir', unvan: 'Doç. Dr.', k_adi: 'aysed', sifre: 'secure456', poliklinik: 2 },
    { ad: 'Mehmet', soyad: 'Kaya', unvan: 'Uzm. Dr.', k_adi: 'mehmetk', sifre: 'abc789', poliklinik: 3 },
  ];
  const hastalar = [
    { ad: 'Zeynep', soyad: 'Koç', yas: 34 },
    { ad: 'Ali', soyad: 'Çelik', yas: 45 },
    { ad: 'Elif', soyad: 'Şahin', yas: 29 },
  ];

  const randevular = [
    { doktor_id: 1, datetime: '2025-05-25 10:00', hasta_id: 1, durum: 'alindi' },
    { doktor_id: 2, datetime: '2025-05-26 11:30', hasta_id: 2, durum: 'mevcut' },
    { doktor_id: 3, datetime: '2025-05-27 14:00', hasta_id: 3, durum: 'tamamlandi' },
  ];

  const insertMany = db.transaction(() => {
    poliklinikler.forEach(name => insertPoliklinik.run(name));
    doktorlar.forEach(doc => insertDoktor.run(doc.ad, doc.soyad, doc.unvan, doc.k_adi, doc.sifre, doc.poliklinik));
    hastalar.forEach(p => insertHasta.run(p.ad, p.soyad, p.yas));
    randevular.forEach(r => insertRandevu.run(r.doktor_id, r.datetime, r.hasta_id, r.durum));
  });

  insertMany();
  console.log('Mock data inserted successfully.');
}

seedDatabase();
