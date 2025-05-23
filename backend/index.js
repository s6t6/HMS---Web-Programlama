// backend/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

const app = express();
const PORT = 5000;
const db = new Database('hms.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS normal_hasta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isim TEXT,
    soyisim TEXT,
    cinsiyet TEXT,
    yas INTEGER
  ),
  CREATE TABLE IF NOT EXISTS yatili_hasta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isim TEXT,
    soyisim TEXT,
    cinsiyet TEXT,
    yas INTEGER
  ),
  CREATE TABLE IF NOT EXISTS randevu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hastaId INTEGER,
    doktorId INTEGER,
    tarih TEXT
  ),
  CREATE TABLE IF NOT EXISTS oda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doluluk INTEGER,
    
  )
`).run();

app.use(cors());
app.use(bodyParser.json());

// Example route
app.get('/api/patients', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', age: 45 },
    { id: 2, name: 'Jane Smith', age: 34 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
