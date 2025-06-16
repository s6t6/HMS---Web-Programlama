const db = require('./db.cjs');

const initDb = () => {
  console.log("Veritabanı şeması oluşturuluyor...");

  db.exec(`
  -- Hasta Tablosu: Hastaların kişisel bilgileri ve portal şifreleri
  CREATE TABLE IF NOT EXISTS hasta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vatandas_id TEXT UNIQUE NOT NULL, -- Benzersiz ve zorunlu vatandaş ID'si
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    yas INTEGER
  );

  -- Poliklinik Tablosu: Hastanedeki poliklinikler
  CREATE TABLE IF NOT EXISTS poliklinik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad TEXT UNIQUE NOT NULL
  );

  -- Doktor Tablosu: Doktorların bilgileri ve poliklinik bağlantıları
  CREATE TABLE IF NOT EXISTS doktor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    unvan TEXT,
    k_adi TEXT UNIQUE NOT NULL, -- Benzersiz ve zorunlu kullanıcı adı
    sifre TEXT NOT NULL,
    poliklinik_id INTEGER,
    FOREIGN KEY (poliklinik_id) REFERENCES poliklinik(id)
  );

  -- Randevu Tablosu: Doktor ve hastaları birleştiren randevu kayıtları
  CREATE TABLE IF NOT EXISTS randevu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doktor_id INTEGER NOT NULL,
    datetime TEXT NOT NULL,
    hasta_id INTEGER,
    durum TEXT CHECK(durum IN ('mevcut', 'alindi', 'iptal', 'tamamlandi')) DEFAULT 'mevcut',
    FOREIGN KEY (doktor_id) REFERENCES doktor(id),
    FOREIGN KEY (hasta_id) REFERENCES hasta(id)
  );

  -- Hasta Kayıt Personeli Tablosu
  CREATE TABLE IF NOT EXISTS hasta_kayit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad TEXT,
    soyad TEXT,
    k_adi TEXT UNIQUE NOT NULL, -- Benzersiz ve zorunlu kullanıcı adı
    sifre TEXT NOT NULL
  );
`);

  console.log("Veritabanı başarıyla kuruldu veya mevcut şema doğrulandı.");
}
module.exports = initDb;