import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sql = neon(process.env.DATABASE_URL || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id, type } = req.body;
    if (!id || !type) return res.status(400).json({ error: 'ID and type required' });

    let rows;
    if (type === 'testimony') {
      rows = await sql`UPDATE testimonies SET likes = likes + 1 WHERE id = ${Number(id)} RETURNING *`;
    } else if (type === 'story') {
      rows = await sql`UPDATE stories SET likes = likes + 1 WHERE id = ${Number(id)} RETURNING *`;
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' });
    return res.json(rows[0]);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'خطأ في السيرفر' });
  }
}
