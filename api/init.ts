import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS testimonies (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        wilaya TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('delay', 'medication', 'treatment', 'other')),
        message TEXT NOT NULL,
        date TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
        likes INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        cancer_type TEXT NOT NULL,
        message TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0,
        date TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Check if empty
    const testimonies = await sql`SELECT COUNT(*) as c FROM testimonies`;
    if (parseInt(testimonies[0].c) === 0) {
      await sql`
        INSERT INTO testimonies (name, wilaya, category, message, date, likes) VALUES
        ('سفيان', 'سطيف', 'delay', 'عندي 4 أشهر وأنا نستنى في الراديوتيرابي في سطيف. كل مرة يقولولي الشهر الجاي. المرض ما يستناش!', '2025-05-08', 24),
        ('خديجة', 'الجزائر', 'medication', 'نبحث عن دواء Fortimel لماما مريضة بسرطان المعدة. مش موجود في الصيدليات من شهرين. إذا حد يعرف وين، ساعدونا.', '2025-05-07', 18),
        ('محمد', 'وهران', 'delay', 'موعد الجراحة تأجل 3 مرات في CHU وهران. 6 أشهر نستنى والورم يكبر. وين حقوقنا؟', '2025-05-06', 31),
        ('فاطمة', 'قسنطينة', 'medication', 'دواء Herceptin غير متوفر من 3 أسابيع في قسنطينة. بنتي تحتاجه كل 21 يوم. اللي عنده معلومة يفيدنا.', '2025-05-05', 27),
        ('عبد الرحمان', 'باتنة', 'treatment', 'جهاز الأشعة في باتنة معطّل من شهر. كل المرضى يتنقلو لسطيف أو قسنطينة. التنقل صعيب على المريض.', '2025-05-04', 42),
        ('نورة', 'تيزي وزو', 'other', 'ما كاينش أخصائي نفسي في مركز السرطان تاعنا. المرضى يحتاجو دعم نفسي مش غير دواء.', '2025-05-03', 15)
      `;
    }

    const stories = await sql`SELECT COUNT(*) as c FROM stories`;
    if (parseInt(stories[0].c) === 0) {
      await sql`
        INSERT INTO stories (name, age, cancer_type, message, likes, date) VALUES
        ('أم سارة', 45, 'سرطان الثدي', 'كنت خايفة بزاف أول مرة دخلت الكيماوي. اليوم، بعد سنتين، رجعت نعيش حياتي عادي. الخوف طبيعي، لكن المرض يتغلب عليه.', 24, '2025-05-01'),
        ('عمي محمد', 58, 'سرطان القولون', 'أصعب حاجة كانت الوحدة. ما كانش من يشرحلي واش راح يصرالي. نصيحتي: اسأل الطبيب، متخجلش.', 18, '2025-04-28'),
        ('نادية', 34, 'سرطان الغدة الدرقية', 'المرض علّمني نقدّر كل يوم. العلاج كان صعب لكن قصير. اليوم أنا بخير والحمد لله.', 31, '2025-04-25'),
        ('كريم', 27, 'لمفوما هودجكين', 'كان عمري 25 وقت عرفت. صدمة. لكن 6 أشهر كيماوي وشفيت. الحياة ما وقفتش.', 42, '2025-04-20')
      `;
    }

    return res.json({ status: 'ok', message: 'Database initialized' });
  } catch (error) {
    console.error('Init Error:', error);
    return res.status(500).json({ error: 'Failed to initialize' });
  }
}
