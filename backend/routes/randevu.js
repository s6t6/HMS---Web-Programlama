import express from 'express';
import db from '../db.cjs';
const router = express.Router();




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


router.get('/doktor/:doktorId/gunluk', requireAuth, (req, res) => {

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

router.get('/doktor/:doktorId/gecmis', requireAuth, (req, res) => {
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

router.get('/doktor/:doktorId/gelecek', requireAuth, (req, res) => {
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

router.get('/mevcut/:poliklinikId', (req, res) => {
  const { poliklinikId } = req.params;
  const today = new Date().toISOString().split('T')[0];

  const stmt = db.prepare(`
    SELECT
     d.ad AS doktor_ad, d.soyad AS doktor_soyad, d.unvan AS doktor_unvan, DATE(r.datetime) AS tarih,
  strftime('%H:%M', datetime) AS saat, r.*
    FROM
      randevu AS r
    JOIN
      doktor AS d ON r.doktor_id = d.id
    WHERE
      d.poliklinik_id = ?
      AND r.durum = 'mevcut'
      AND DATE(r.datetime) > ?
    ORDER BY r.datetime;
    `).all(poliklinikId, today);
    res.json(stmt);
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


router.put('/durum-guncelle/:randevuId', requireAuth, (req, res) => {
  const { randevuId } = req.params;
  const { durum } = req.body;

  if (!['tamamlandi', 'iptal', 'mevcut'].includes(durum)) {
    return res.status(400).json({ error: 'Geçersiz durum' });
  }
  
  try {
    const stmt = db.prepare('UPDATE randevu SET durum = ? WHERE id = ?');
    const info = stmt.run(durum, randevuId);

    if (info.changes > 0) {
      res.json({ success: true, message: 'Randevu durumu güncellendi.' });
    } else {
      res.status(404).json({ success: false, message: 'Randevu bulunamadı.' });
    }
  } catch (error) {
    console.error("Randevu güncelleme hatası:", error);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
});

router.put('/:randevuId/onayla', (req, res) => {
    const { randevuId } = req.params;
    const { hasta_id } = req.body;

    if (!hasta_id) {
        return res.status(400).json({ hata: 'Geçerli bir hasta ID\'si gereklidir.' });
    }

    try {
        // İşlemin güvenli olması için randevunun hala 'mevcut' olup olmadığını kontrol et
        const randevu = db.prepare('SELECT durum FROM randevu WHERE id = ?').get(randevuId);

        if (!randevu) {
            return res.status(404).json({ hata: 'Onaylanmak istenen randevu bulunamadı.' });
        }

        if (randevu.durum !== 'mevcut') {
            return res.status(409).json({ hata: 'Bu randevu başka bir kullanıcı tarafından alınmış veya iptal edilmiş.' });
        }

        // Randevuyu güncelle: durumunu 'alindi' yap ve hasta_id'yi ata
        const stmt = db.prepare('UPDATE randevu SET hasta_id = ?, durum = \'alindi\' WHERE id = ?');
        const info = stmt.run(hasta_id, randevuId);

        if (info.changes > 0) {
            res.status(200).json({ success: true, mesaj: 'Randevu başarıyla oluşturuldu.' });
        } else {
            res.status(500).json({ hata: 'Bilinmeyen bir nedenle randevu güncellenemedi.' });
        }
    } catch (error) {
        console.error("Randevu onaylama sunucu hatası:", error);
        res.status(500).json({ hata: 'Sunucu tarafında bir hata oluştu.' });
    }
});


export default router;
