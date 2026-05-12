const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Create tables
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      wilaya TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('delay', 'medication', 'treatment', 'other')),
      message TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
      likes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      cancer_type TEXT NOT NULL,
      message TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Insert sample data if empty
  const { rows } = await pool.query('SELECT COUNT(*) as c FROM testimonies');
  if (parseInt(rows[0].c) === 0) {
    await pool.query(`
      INSERT INTO testimonies (name, wilaya, category, message, date, likes) VALUES
      ('سفيان', 'سطيف', 'delay', 'عندي 4 أشهر وأنا نستنى في الراديوتيرابي في سطيف. كل مرة يقولولي الشهر الجاي. المرض ما يستناش!', '2025-05-08', 24),
      ('خديجة', 'الجزائر', 'medication', 'نبحث عن دواء Fortimel لماما مريضة بسرطان المعدة. مش موجود في الصيدليات من شهرين. إذا حد يعرف وين، ساعدونا.', '2025-05-07', 18),
      ('محمد', 'وهران', 'delay', 'موعد الجراحة تأجل 3 مرات في CHU وهران. 6 أشهر نستنى والورم يكبر. وين حقوقنا؟', '2025-05-06', 31),
      ('فاطمة', 'قسنطينة', 'medication', 'دواء Herceptin غير متوفر من 3 أسابيع في قسنطينة. بنتي تحتاجه كل 21 يوم. اللي عنده معلومة يفيدنا.', '2025-05-05', 27),
      ('عبد الرحمان', 'باتنة', 'treatment', 'جهاز الأشعة في باتنة معطّل من شهر. كل المرضى يتنقلو لسطيف أو قسنطينة. التنقل صعيب على المريض.', '2025-05-04', 42),
      ('نورة', 'تيزي وزو', 'other', 'ما كاينش أخصائي نفسي في مركز السرطان تاعنا. المرضى يحتاجو دعم نفسي مش غير دواء.', '2025-05-03', 15);
    `);
  }

  const storyRes = await pool.query('SELECT COUNT(*) as c FROM stories');
  if (parseInt(storyRes.rows[0].c) === 0) {
    await pool.query(`
      INSERT INTO stories (name, age, cancer_type, message, likes, date) VALUES
      ('أم سارة', 45, 'سرطان الثدي', 'كنت خايفة بزاف أول مرة دخلت الكيماوي. اليوم، بعد سنتين، رجعت نعيش حياتي عادي. الخوف طبيعي، لكن المرض يتغلب عليه.', 24, '2025-05-01'),
      ('عمي محمد', 58, 'سرطان القولون', 'أصعب حاجة كانت الوحدة. ما كانش من يشرحلي واش راح يصرالي. نصيحتي: اسأل الطبيب، متخجلش.', 18, '2025-04-28'),
      ('نادية', 34, 'سرطان الغدة الدرقية', 'المرض علّمني نقدّر كل يوم. العلاج كان صعب لكن قصير. اليوم أنا بخير والحمد لله.', 31, '2025-04-25'),
      ('كريم', 27, 'لمفوما هودجكين', 'كان عمري 25 وقت عرفت. صدمة. لكن 6 أشهر كيماوي وشفيت. الحياة ما وقفتش.', 42, '2025-04-20');
    `);
  }

  console.log('Database initialized');
}

// Middleware
const allowedOrigins = [
  'https://rafikdz.com',
  'https://www.rafikdz.com',
  'https://rafiq.soufian12e.workers.dev',
  'http://localhost:5174',
  'http://192.168.1.30:5174',
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 POST requests per minute per IP
  message: { error: 'طلبات كثيرة بزاف. انتظر شوية.' },
});

const likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // 20 likes per minute per IP
  message: { error: 'طلبات كثيرة بزاف.' },
});

// ===== TESTIMONIES API =====

app.get('/api/testimonies', async (req, res) => {
  try {
    const { category } = req.query;
    let result;
    if (category && category !== 'all') {
      result = await pool.query('SELECT * FROM testimonies WHERE category = $1 ORDER BY id DESC', [category]);
    } else {
      result = await pool.query('SELECT * FROM testimonies ORDER BY id DESC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

app.get('/api/testimonies/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM testimonies');
    const delay = await pool.query("SELECT COUNT(*) FROM testimonies WHERE category = 'delay'");
    const medication = await pool.query("SELECT COUNT(*) FROM testimonies WHERE category = 'medication'");
    res.json({
      total: parseInt(total.rows[0].count),
      delay: parseInt(delay.rows[0].count),
      medication: parseInt(medication.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

app.post('/api/testimonies', postLimiter, async (req, res) => {
  try {
    const { name, wilaya, category, message } = req.body;
    if (!name || !wilaya || !category || !message) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }
    if (name.length > 50 || message.length > 1000 || wilaya.length > 50) {
      return res.status(400).json({ error: 'النص طويل بزاف' });
    }
    const validCategories = ['delay', 'medication', 'treatment', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'تصنيف غير صحيح' });
    }
    const result = await pool.query(
      "INSERT INTO testimonies (name, wilaya, category, message, date) VALUES ($1, $2, $3, $4, CURRENT_DATE::TEXT) RETURNING *",
      [name.trim(), wilaya, category, message.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

app.post('/api/testimonies/:id/like', likeLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE testimonies SET likes = likes + 1 WHERE id = $1 RETURNING *', [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'غير موجود' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// ===== STORIES API =====

app.get('/api/stories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stories ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

app.post('/api/stories', postLimiter, async (req, res) => {
  try {
    const { name, age, cancer_type, message } = req.body;
    if (!name || !cancer_type || !message) {
      return res.status(400).json({ error: 'الاسم، نوع السرطان، والرسالة مطلوبين' });
    }
    if (name.length > 50 || message.length > 2000 || cancer_type.length > 100) {
      return res.status(400).json({ error: 'النص طويل بزاف' });
    }
    const result = await pool.query(
      "INSERT INTO stories (name, age, cancer_type, message, date) VALUES ($1, $2, $3, $4, CURRENT_DATE::TEXT) RETURNING *",
      [name.trim(), age || null, cancer_type.trim(), message.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

app.post('/api/stories/:id/like', likeLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE stories SET likes = likes + 1 WHERE id = $1 RETURNING *', [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'غير موجود' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'rafiq' });
});

// Start
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});
