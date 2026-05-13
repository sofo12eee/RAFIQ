import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sql = neon(process.env.DATABASE_URL || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { category } = req.query;
      const rows = category && category !== 'all'
        ? await sql`SELECT * FROM testimonies WHERE category = ${category} ORDER BY id DESC`
        : await sql`SELECT * FROM testimonies ORDER BY id DESC`;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { name, wilaya, category, message } = req.body;
      if (!name || !wilaya || !category || !message) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
      }
      const rows = await sql`
        INSERT INTO testimonies (name, wilaya, category, message, date)
        VALUES (${name.trim()}, ${wilaya}, ${category}, ${message.trim()}, CURRENT_DATE::TEXT)
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'خطأ في السيرفر' });
  }
}
