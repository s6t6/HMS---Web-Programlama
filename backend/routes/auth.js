import express from "express";
const router = express.Router();
import db from '../db.cjs';

router.post('/doktor-login', (req, res) => {
  const { k_adi, sifre } = req.body;

  const stmt = db.prepare('SELECT * FROM doktor WHERE k_adi = ? AND sifre = ?');
  const doktor = stmt.get(k_adi, sifre);
  
  if (doktor) {
    req.session.doktor = {
      id: doktor.id,
      ad: doktor.ad,
      soyad: doktor.soyad,
      unvan: doktor.unvan,
      k_adi: doktor.k_adi
    }

    console.log(req.session.doktor);

    res.json({ success: true, doktorId: doktor.id, ad: doktor.ad, unvan: doktor.unvan});

  } else {
    res.status(401).json({ success: false, message: 'Giriş bilgileri yanlış' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout error');
    }
    res.send('Çıkış yapıldı');
  });
});

router.post('/hastakayit-login', (req, res) => {
    const { k_adi, sifre } = req.body;
    const stmt = db.prepare('SELECT * FROM hasta_kayit WHERE k_adi = ? AND sifre = ?');
    const user = stmt.get(k_adi, sifre);

    if (user) {
        req.session.hastaKayitUser = {
            id: user.id,
            ad: user.ad,
            soyad: user.soyad,
            k_adi: user.k_adi
        };
        res.json({ success: true, hkId: user.id, ad: user.ad });
    } else {
        res.status(401).json({ success: false, message: 'Giriş bilgileri yanlış' });
    }
});

export const requireDoktorAuth = (req, res, next) => {
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

export const requireHKAuth = (req, res, next) => {
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - HK:', req.session?.hastaKayitUser);
  
  if (!req.session || !req.session.hastaKayitUser || !req.session.hastaKayitUser.id) {
    return res.status(401).json({ 
      error: 'Oturum açmanız gerekiyor',
      hasSession: !!req.session,
      hasHK: !!req.session?.hastaKayitUser 
    });
  }
  next();
};


export default router;
