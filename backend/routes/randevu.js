const express = require('express');
const router = express.Router();
const db = require('../db'); // SQLite connection

// Get appointments grouped by day (taken only)
router.get('/doktor/:doktorId/gunluk', (req, res) => {
  const { doktorId } = req.params;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const query = `
    SELECT * FROM randevu 
    WHERE doktor_id = ? AND date(datetime) = ? AND durum = 'alindi'
    ORDER BY datetime
  `;
  const randevu = db.prepare(query).all(doktorId, today);
  res.json(randevu);
});

// Get future and past appointments
router.get('/doktor/:doktorId/gecmis', (req, res) => {
  const { doktorId } = req.params;
  const now = new Date().toISOString();

  const gecmis = db.prepare(`
    SELECT * FROM randevu
    WHERE doktor_id = ? AND datetime <= ? AND durum IN ('tamamlandi', 'iptal')
    ORDER BY datetime DESC
  `).all(doktorId, now);

  res.json({ gecmis });
});

router.get('/doktor/:doktorId/gelecek', (req, res) => {
  const { doktorId } = req.params;
  const now = new Date().toISOString();

  const gelecek = db.prepare(`
    SELECT * FROM randevu
    WHERE doktor_id = ? AND datetime > ? AND durum IN ('alindi')
    ORDER BY datetime
  `).all(doktorId, now);

  res.json({ gelecek });
});

// Update appointment status (complete or cancel)
router.post('/doktor/:doktorId/randevu/:randevuId/durum', (req, res) => {
  const { randevuId } = req.params;
  const { durum } = req.body;

  if (!['tamamlandi', 'iptal'].includes(durum)) {
    return res.status(400).json({ error: 'Geçersiz Durum' });
  }

  const update = db.prepare(`
    UPDATE randevu
    SET durum = ?
    WHERE id = ?
  `);

  const result = update.run(durum, randevuId);
  res.json({ updated: result.changes > 0 });
});

module.exports = router;
