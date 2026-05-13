import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const [total, delay, medication] = await Promise.all([
      pool.query('SELECT COUNT(*) as c FROM testimonies'),
      pool.query("SELECT COUNT(*) as c FROM testimonies WHERE category = 'delay'"),
      pool.query("SELECT COUNT(*) as c FROM testimonies WHERE category = 'medication'"),
    ]);

    return res.json({
      total: parseInt(total.rows[0].c),
      delay: parseInt(delay.rows[0].c),
      medication: parseInt(medication.rows[0].c),
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'خطأ في السيرفر' });
  }
}
