import express from 'express';
const router = express.Router();
import db from '../db.cjs';
import { requireHKAuth } from './auth.js';


router.get('/hepsi/', requireHKAuth,(req, res) => {
    
    const sorgu = db.prepare(`
        SELECT
        *
        FROM poliklinik;
        `).all();

    res.json(sorgu);
});

export default router;