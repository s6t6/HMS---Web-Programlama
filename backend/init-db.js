const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS hasta (
    id INTEGER PRIMARY KEY,
    ad TEXT,
    soyad TEXT,
    yas INTEGER
);

CREATE TABLE IF NOT EXISTS doktor (
    id INTEGER PRIMARY KEY,
    ad TEXT,
    soyad TEXT,
    unvan TEXT,
    k_adi TEXT, -- Kullanıcı Adı
    sifre TEXT,
    poliklinik_id INTEGER,
    FOREIGN KEY (poliklinik_id) REFERENCES poliklinik(id)
);

CREATE TABLE IF NOT EXISTS poliklinik (
    id INTEGER PRIMARY KEY,
    ad TEXT
);

CREATE TABLE IF NOT EXISTS randevu (
    id INTEGER PRIMARY KEY,
    doktor_id INTEGER NOT NULL,
    datetime TEXT NOT NULL,
    hasta_id INTEGER,
    durum TEXT CHECK(durum IN ('mevcut', 'alindi', 'iptal', 'tamamlandi')) DEFAULT 'mevcut',
    FOREIGN KEY (doktor_id) REFERENCES doktor(id),
    FOREIGN KEY (hasta_id) REFERENCES hasta(id)
);

`);

console.log("DB başarılı bir şekilde kuruldu.")