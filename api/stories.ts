import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM stories ORDER BY id DESC');
      return res.json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, age, cancerType, message } = req.body;
      if (!name || !cancerType || !message) {
        return res.status(400).json({ error: 'الاسم، نوع السرطان، والرسالة مطلوبين' });
      }
      const result = await pool.query(
        'INSERT INTO stories (name, age, cancer_type, message, date) VALUES ($1, $2, $3, $4, CURRENT_DATE::TEXT) RETURNING *',
        [name.trim(), age ? Number(age) : null, cancerType.trim(), message.trim()]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'خطأ في السيرفر' });
  }
}
