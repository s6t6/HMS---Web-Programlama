import express from "express";
const router = express.Router();
import db from '../db.js';

router.post('/doktor-login', (req, res) => {
  const { k_adi, sifre } = req.body;

  const stmt = db.prepare('SELECT * FROM doktor WHERE k_adi = ? AND sifre = ?');
  const doktor = stmt.get(k_adi, sifre);

  // FIXME: bu kısım düzgün çalışmıyor olabilir. session varken doktor = undefined
  
  if (doktor) {
    req.session.doktor = {
      id: doktor.id,
      ad: doktor.ad,
      soyad: doktor.soyad,
      unvan: doktor.unvan,
      k_adi: doktor.k_adi
    }

    res.json({ success: true, doktorId: doktor.id, ad: doktor.ad });

  } else {
    res.status(401).json({ success: false, message: 'Giriş bilgileri yanlış' });
  }
});

export const requireAuth = (req, res, next) => {
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - Doktor:', req.session?.doktor);
  
  if (!req.session || !req.session.doktor || !req.session.doktor.id) {
    return res.status(401).json({ 
      error: 'Oturum açmanız gerekiyor',
      hasSession: !!req.session,
      hasDoktor: !!req.session?.doktor 
    });
  }
  next();
};

export default router;
