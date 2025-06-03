import express from 'express';
import db from '../db.js';
const router = express.Router();



// FIXME: sessionlar düzgün tutulmuyor veya oluşturulmuyor

const requireAuth = (req, res, next) => {
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - Doktor:', req.session?.doktor);

  if (!req.session || !req.session.doktor) {
    return res.status(401).json({
      error: 'Oturum açmanız gerekiyor',
      hasSession: !!req.session,
      hasDoktor: !!req.session?.doktor
    });
  }
  next();
};


router.get('/doktor/:doktorId/gunluk', (req, res) => {

  const { doktorId } = req.params;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const query = `
    SELECT 
  r.id AS randevu_id,
  DATE(r.datetime) AS tarih,
  strftime('%H:%M', datetime) AS saat,
  r.durum,
  h.ad AS hasta_ad,
  h.soyad AS hasta_soyad
FROM 
  randevu r
LEFT JOIN 
  hasta h ON r.hasta_id = h.id
WHERE 
  r.doktor_id = ?
  AND DATE(r.datetime) = ?
  AND r.durum IN ('alindi', 'iptal', 'tamamlandi')
ORDER BY datetime;
  `;
  const randevu = db.prepare(query).all(doktorId, today);
  res.json(randevu);
});

router.get('/doktor/:doktorId/gecmis', (req, res) => {
  const { doktorId } = req.params;
  const now = new Date().toISOString().split('T')[0];

  console.log(now);

  const query = `
    SELECT 
  r.id AS randevu_id,
  DATE(r.datetime) AS tarih,
  strftime('%H:%M', datetime) AS saat,
  r.durum,
  h.ad AS hasta_ad,
  h.soyad AS hasta_soyad
FROM 
  randevu r
LEFT JOIN 
  hasta h ON r.hasta_id = h.id
WHERE 
  r.doktor_id = ?
  AND DATE(r.datetime) < ?
  AND r.durum IN ('iptal', 'tamamlandi')
  ORDER BY datetime DESC;
  `;

  const gecmis = db.prepare(query).all(doktorId, now);

  res.json(gecmis);
});

router.get('/doktor/:doktorId/gelecek', (req, res) => {
  const { doktorId } = req.params;
  const now = new Date().toISOString().split('T')[0];

  const gelecek = db.prepare(`
    SELECT 
  r.id AS randevu_id,
  DATE(r.datetime) AS tarih,
  strftime('%H:%M', datetime) AS saat,
  r.durum,
  h.ad AS hasta_ad,
  h.soyad AS hasta_soyad
FROM 
  randevu r
LEFT JOIN 
  hasta h ON r.hasta_id = h.id
WHERE 
  r.doktor_id = ?
  AND DATE(r.datetime) > ?
  AND r.durum IN ('alindi', 'iptal', 'tamamlandi')
  ORDER BY datetime;
  `).all(doktorId, now);

  res.json(gelecek);
});

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



export default router;
