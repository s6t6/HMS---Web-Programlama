import express from 'express';
import db from '../db.cjs';
import { requireHKAuth } from './auth.js';

const router = express.Router();

router.get('/ara/:sorgu', requireHKAuth, (req, res) => {
    const { sorgu } = req.params;
    const aramaParametresi = `${sorgu}%`;

    const stmt = db.prepare(`
        SELECT * FROM hasta 
        WHERE 
            LOWER(ad) LIKE LOWER(?) OR 
            LOWER(soyad) LIKE LOWER(?) OR 
            CAST(vatandas_id AS TEXT) LIKE ? OR
            LOWER(ad || ' ' || soyad) LIKE LOWER(?)
        ORDER BY ad, soyad
        LIMIT 20;
    `);
    
    const sonuclar = stmt.all(aramaParametresi, aramaParametresi, aramaParametresi, `%${sorgu}%`);
    res.json(sonuclar);
});

router.post('/yeni', requireHKAuth,(req, res) => {
    const { vatandas_id, ad, soyad, yas } = req.body;

    if (!vatandas_id || !ad || !soyad || yas === undefined) {
        return res.status(400).json({ hata: 'Lütfen tüm alanları eksiksiz doldurun.' });
    }
    if (!/^\d{5}$/.test(vatandas_id)) {
        return res.status(400).json({ hata: 'Vatandaş ID 5 haneli bir sayı olmalıdır.' });
    }

    try {
        const stmt = db.prepare('INSERT INTO hasta (vatandas_id, ad, soyad, yas) VALUES (?, ?, ?, ?)');
        const info = stmt.run(vatandas_id, ad, soyad, Number(yas));
        
        res.status(201).json({
            mesaj: 'Hasta başarıyla kaydedildi.',
            hasta: { id: info.lastInsertRowid, vatandas_id, ad, soyad, yas }
        });
    } catch (hata) {
        if (hata.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ hata: 'Bu vatandaş ID\'si zaten sistemde kayıtlı.' });
        }
        console.error('Hasta ekleme sunucu hatası:', hata);
        res.status(500).json({ hata: 'Sunucu hatası nedeniyle hasta kaydedilemedi.' });
    }
});


export default router;