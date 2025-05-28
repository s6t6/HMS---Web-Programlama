const db =  require('./db');

function query(){
   const query = `
       SELECT * FROM randevu 
       WHERE doktor_id = ? AND durum = 'alindi'
       ORDER BY datetime
     `;
     const sonuc = db.prepare(query).all(1);
     console.log(sonuc);
}

query();