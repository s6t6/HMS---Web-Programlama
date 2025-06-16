const db = require('./db.cjs');

const seedDb = () => {
  const { randomInt } = require('crypto');

const isimler = ['Ali', 'Ayşe', 'Mehmet', 'Fatma', 'Can', 'Zeynep', 'Emre', 'Elif', 'Ahmet', 'Merve', 'Burak', 'Gizem', 'Hüseyin', 'Melis', 'Okan', 'Esra', 'Yusuf', 'Nazlı', 'Baran', 'Selin', 'Kerem', 'Derya', 'Seda', 'Cem', 'Ebru', 'Deniz', 'Cansu', 'Halil', 'Irem', 'Serkan', 'Tuba', 'Efe', 'Betül', 'Volkan', 'Pelin', 'Mert', 'Büşra', 'Onur', 'Sinem', 'Kaan', 'Tuğba', 'Tolga', 'Dilara', 'Engin', 'Melike', 'Hakan', 'Sevil', 'Berat', 'Yasemin', 'Taner'];
const soyadlar = ['Yılmaz', 'Demir', 'Şahin', 'Kaya', 'Çelik', 'Aydın', 'Arslan', 'Doğan', 'Öztürk', 'Koç', 'Kurt', 'Yıldız', 'Aslan', 'Kara', 'Bozkurt', 'Aksoy', 'Güneş', 'Turan', 'Erdoğan', 'Toprak', 'Çetin', 'Polat', 'Türkmen', 'Soylu', 'Uzun', 'Ekinci', 'Köse', 'Özdemir', 'Altun', 'Uçar', 'Ergin', 'Korkmaz', 'Yüce', 'Aydoğdu', 'Taş', 'Özkan', 'Er', 'İnce', 'Yavuz', 'Kaplan', 'Sezer', 'Baran', 'Bayraktar', 'Baş', 'Yaman', 'Alp', 'Boz', 'Önal', 'Dinç', 'Ersoy'];

function getRandomName() {
  return {
    ad: isimler[randomInt(isimler.length)],
    soyad: soyadlar[randomInt(soyadlar.length)],
  };
}

// Önce tüm tablolardaki verileri temizle
console.log('Mevcut veriler siliniyor...');
db.exec(`
  DELETE FROM randevu;
  DELETE FROM doktor;
  DELETE FROM hasta;
  DELETE FROM poliklinik;
  DELETE FROM hasta_kayit;
`);

// Poliklinikleri ekle
const insertPoliklinik = db.prepare("INSERT INTO poliklinik (ad) VALUES (?)");
const poliklinikNames = ["Dahiliye", "KBB", "Ortopedi", "Dermatoloji", "Kardiyoloji"];
poliklinikNames.forEach(name => insertPoliklinik.run(name));
const poliklinikler = db.prepare("SELECT id FROM poliklinik").all();

// Doktorları ekle
const insertDoktor = db.prepare(`INSERT INTO doktor (ad, soyad, unvan, k_adi, sifre, poliklinik_id) VALUES (?, ?, ?, ?, ?, ?)`);
const doktorlar = [];
const seedDoktorlar = db.transaction(() => {
  for (let i = 0; i < 5; i++) {
    const { ad, soyad } = getRandomName();
    const unvan = ['Uzm. Dr.', 'Op. Dr.', 'Dr.'][randomInt(3)];
    const k_adi = `${ad.toLowerCase().replace('ı', 'i')}${i}`;
    const sifre = '1234';
    const poliklinik_id = poliklinikler[randomInt(poliklinikler.length)].id;
    const info = insertDoktor.run(ad, soyad, unvan, k_adi, sifre, poliklinik_id);
    doktorlar.push({ id: info.lastInsertRowid });
  }
});
seedDoktorlar();

// Hastaları ekle
const insertHasta = db.prepare("INSERT INTO hasta (vatandas_id, ad, soyad, yas) VALUES (?, ?, ?, ?)");
const hastalar = [];
const seedHastalar = db.transaction(() => {
  for (let i = 0; i < 50; i++) {
    const { ad, soyad } = getRandomName();
    const yas = randomInt(18, 80);
    const vatandas_id = (10000 + i).toString();
    const info = insertHasta.run(vatandas_id, ad, soyad, yas);
    hastalar.push(info.lastInsertRowid);
  }
});
seedHastalar();

// Hasta Kayıt Personelini ekle
const insertHastaKayit = db.prepare("INSERT INTO hasta_kayit (ad, soyad, k_adi, sifre) VALUES (?, ?, ?, ?)");
insertHastaKayit.run('Personel', 'Bir', 'personel1', '1234');

// Randevuları oluştur
const insertRandevu = db.prepare(`INSERT INTO randevu (doktor_id, datetime, hasta_id, durum) VALUES (?, ?, ?, ?)`);
const now = new Date();
now.setHours(0, 0, 0, 0);
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_BACK = 30;
const DAYS_FORWARD = 30;
const APPOINTMENTS_PER_DAY = 10;

const seedRandevular = db.transaction(() => {
  for (let d = -DAYS_BACK; d <= DAYS_FORWARD; d++) {
    const date = new Date(now.getTime() + d * MS_PER_DAY);
    for (const doktor of doktorlar) {
      for (let i = 0; i < APPOINTMENTS_PER_DAY; i++) {
        const hour = 9 + i;
        if (hour >= 17) continue; // Akşam 5'ten sonra randevu yok
        const randevuTime = new Date(date);
        randevuTime.setHours(hour, 0, 0, 0); // Saat başı randevu
        const datetimeStr = randevuTime.toISOString();

        let durum, hasta_id = null;
        const roll = Math.random();
        if (d < 0) { // Geçmiş günler
          durum = roll < 0.8 ? 'tamamlandi' : 'iptal';
          hasta_id = hastalar[randomInt(hastalar.length)];
        } else { // Bugün ve gelecek günler
          if (roll < 0.3) {
            durum = 'mevcut'; // Boş randevu
          } else {
            durum = roll < 0.8 ? 'alindi' : 'iptal';
            hasta_id = hastalar[randomInt(hastalar.length)];
          }
        }
        insertRandevu.run(doktor.id, datetimeStr, hasta_id, durum);
      }
    }
  }
});
seedRandevular();

console.log("Veritabanı başarıyla test verileriyle dolduruldu!");
}
module.exports = seedDb;