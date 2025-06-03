const db = require('./db');
const { randomInt } = require('crypto');

const now = new Date();
now.setHours(0, 0, 0, 0);
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_BACK = 90;
const DAYS_FORWARD = 90;
const APPOINTMENTS_PER_DAY = 15;

const isimler = [
  'Ali', 'Ayşe', 'Mehmet', 'Fatma', 'Can', 'Zeynep', 'Emre', 'Elif', 'Ahmet', 'Merve',
  'Burak', 'Gizem', 'Hüseyin', 'Melis', 'Okan', 'Esra', 'Yusuf', 'Nazlı', 'Baran', 'Selin',
  'Kerem', 'Derya', 'Seda', 'Cem', 'Ebru', 'Deniz', 'Cansu', 'Halil', 'Irem', 'Serkan',
  'Tuba', 'Efe', 'Betül', 'Volkan', 'Pelin', 'Mert', 'Büşra', 'Onur', 'Sinem', 'Kaan',
  'Tuğba', 'Tolga', 'Dilara', 'Engin', 'Melike', 'Hakan', 'Sevil', 'Berat', 'Yasemin', 'Taner'
];

const soyadlar = [
  'Yılmaz', 'Demir', 'Şahin', 'Kaya', 'Çelik', 'Aydın', 'Arslan', 'Doğan',
  'Öztürk', 'Koç', 'Kurt', 'Yıldız', 'Aslan', 'Kara', 'Bozkurt', 'Aksoy', 'Güneş', 'Turan',
  'Erdoğan', 'Toprak', 'Çetin', 'Polat', 'Türkmen', 'Soylu', 'Uzun', 'Ekinci', 'Köse', 'Özdemir',
  'Altun', 'Uçar', 'Ergin', 'Korkmaz', 'Yüce', 'Aydoğdu', 'Taş', 'Özkan', 'Er', 'İnce', 'Yavuz',
  'Kaplan', 'Sezer', 'Baran', 'Bayraktar', 'Baş', 'Yaman', 'Alp', 'Boz', 'Önal', 'Dinç', 'Ersoy'
];

function getRandomName() {
  return {
    ad: isimler[randomInt(isimler.length)],
    soyad: soyadlar[randomInt(soyadlar.length)],
  };
}

db.exec(`
  DELETE FROM randevu;
  DELETE FROM doktor;
  DELETE FROM hasta;
  DELETE FROM poliklinik;
`);

const insertPoliklinik = db.prepare("INSERT INTO poliklinik (ad) VALUES (?)");
const poliklinikNames = ["Dahiliye", "KBB", "Ortopedi", "Dermatoloji"];
for (const name of poliklinikNames) insertPoliklinik.run(name);

const poliklinikler = db.prepare("SELECT id FROM poliklinik").all();

const insertDoktor = db.prepare(`
  INSERT INTO doktor (ad, soyad, unvan, k_adi, sifre, poliklinik_id)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertHasta = db.prepare("INSERT INTO hasta (ad, soyad, yas) VALUES (?, ?, ?)");

const insertRandevu = db.prepare(`
  INSERT INTO randevu (doktor_id, datetime, hasta_id, durum)
  VALUES (?, ?, ?, ?)
`);

const doktorlar = [];
const seedDoktorlar = db.transaction(() => {
  for (let i = 0; i < 5; i++) {
    const { ad, soyad } = getRandomName();
    const unvan = ['Uzm. Dr.', 'Op. Dr.', 'Dr.'][randomInt(3)];
    const k_adi = `${ad.toLowerCase()}${i}`;
    const sifre = '1234';
    const poliklinik_id = poliklinikler[randomInt(poliklinikler.length)].id;

    const info = insertDoktor.run(ad, soyad, unvan, k_adi, sifre, poliklinik_id);
    doktorlar.push({ id: info.lastInsertRowid });
  }
});
seedDoktorlar();

const hastalar = [];
const seedHastalar = db.transaction(() => {
  for (let i = 0; i < 50; i++) {
    const { ad, soyad } = getRandomName();
    const yas = randomInt(18, 80);
    const info = insertHasta.run(ad, soyad, yas);
    hastalar.push(info.lastInsertRowid);
  }
});
seedHastalar();

const seedRandevular = db.transaction(() => {
  for (let d = -DAYS_BACK; d <= DAYS_FORWARD; d++) {
    const date = new Date(now.getTime() + d * MS_PER_DAY);
    for (const doktor of doktorlar) {
      for (let i = 0; i < APPOINTMENTS_PER_DAY; i++) {
        const hour = 8 + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        const randevuTime = new Date(date);
        randevuTime.setHours(hour, minute, 0, 0);
        const datetimeStr = randevuTime.toISOString();

        let durum, hasta_id = null;
        if (d < 0) {
          durum = Math.random() < 0.5 ? 'tamamlandi' : 'iptal';
          hasta_id = hastalar[randomInt(hastalar.length)];
        } else {
          const roll = Math.random();
          if (roll < 0.3) {
            durum = 'iptal';
            hasta_id = hastalar[randomInt(hastalar.length)];
          } else if (roll < 0.6) {
            durum = 'alindi';
            hasta_id = hastalar[randomInt(hastalar.length)];
          } else {
            durum = 'mevcut';
          }
        }

        insertRandevu.run(doktor.id, datetimeStr, hasta_id, durum);
      }
    }
  }
});
seedRandevular();

console.log("Veritabanı başarıyla dolduruldu!");
