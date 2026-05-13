import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { category } = req.query;
      const result = category && category !== 'all'
        ? await pool.query('SELECT * FROM testimonies WHERE category = $1 ORDER BY id DESC', [category])
        : await pool.query('SELECT * FROM testimonies ORDER BY id DESC');
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, wilaya, category, message } = req.body;
      if (!name || !wilaya || !category || !message) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
      }
      const result = await pool.query(
        'INSERT INTO testimonies (name, wilaya, category, message, date) VALUES ($1, $2, $3, $4, CURRENT_DATE::TEXT) RETURNING *',
        [name.trim(), wilaya, category, message.trim()]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'خطأ في السيرفر' });
  }
}
