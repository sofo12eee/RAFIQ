import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM stories ORDER BY id DESC`;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { name, age, cancerType, message } = req.body;
      if (!name || !cancerType || !message) {
        return res.status(400).json({ error: 'الاسم، نوع السرطان، والرسالة مطلوبين' });
      }
      const rows = await sql`
        INSERT INTO stories (name, age, cancer_type, message, date)
        VALUES (${name.trim()}, ${age ? Number(age) : null}, ${cancerType.trim()}, ${message.trim()}, CURRENT_DATE::TEXT)
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
