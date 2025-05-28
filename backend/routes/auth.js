// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/doktor-login', (req, res) => {
  const { k_adi, sifre } = req.body;

  const stmt = db.prepare('SELECT * FROM doktor WHERE k_adi = ? AND sifre = ?');
  const doktor = stmt.get(k_adi, sifre);

  if (doktor) {
    res.json({ success: true, doktorId: doktor.id, ad: doktor.ad });
  } else {
    res.status(401).json({ success: false, message: 'Giriş bilgileri yanlış' });
  }
});

module.exports = router;
