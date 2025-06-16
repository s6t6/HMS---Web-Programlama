import express from 'express';
import db from '../db.cjs';
import initDb from '../init-db.cjs';
import seedDb from '../seed.cjs';

const router = express.Router();

// Veritabanı şemasını oluşturan endpoint
router.post('/init-db', (req, res) => {
    try {
        initDb();
        
        res.json({ 
            success: true, 
            message: 'Veritabanı şeması başarıyla oluşturuldu veya mevcut olduğu doğrulandı.' 
        });
    } catch (error) {
        console.error('init-db endpoint hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Veritabanı oluşturulurken bir sunucu hatası oluştu.' 
        });
    }
});

// Veritabanına test verilerini ekleyen endpoint
router.post('/seed-db', (req, res) => {
    try {
       seedDb();

        res.json({ 
            success: true, 
            message: 'Veritabanı başarıyla test verileriyle dolduruldu.' 
        });
    } catch (error) {
        console.error('seed-db endpoint hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Veritabanına veri eklenirken bir sunucu hatası oluştu.' 
        });
    }
});

router.get('/demo/doktor/girisInfo', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT k_adi, sifre FROM doktor LIMIT 1;
            `).all();
    
            res.json(stmt);
    
    } catch (error) {
        console.error('Demo için giriş bilgileri alınamadı:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Veritabanından giriş bilgileri alınırken bir sunucu hatası oluştu.' 
        });
    }
})
router.get('/demo/hastakayit/girisInfo', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT k_adi, sifre FROM hasta_kayit LIMIT 1;
            `).all();
    
            res.json(stmt);
    } catch (error) {
        console.error('Demo için giriş bilgileri alınamadı:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Veritabanından giriş bilgileri alınırken bir sunucu hatası oluştu.' 
        });
    }
})

export default router;
