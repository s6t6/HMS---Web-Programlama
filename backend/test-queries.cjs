const db =  require('./db.cjs');

// DB'ye test sorgular yapmak için kullanılıyor. Önemli bir dosya değil

function query(){
   const query = `
       SELECT * FROM doktor
     `;
     const sonuc = db.prepare(query).all();
     console.log(sonuc);
}

query();