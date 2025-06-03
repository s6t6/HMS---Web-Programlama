const db = require('./db');


// DB'ye test sorgular yapmak için kullanılıyor. Önemli bir dosya değil

function query() {
    const now = new Date().toISOString().split('T')[0];
    const query = `
    SELECT DATE(datetime) FROM randevu
    WHERE doktor_id = ?;
  `;
    const sonuc = db.prepare(query).all(1);
    console.log(sonuc);
}

query();