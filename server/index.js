const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.RAILWAY_VOLUME_MOUNT_PATH 
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'rafiq.db')
  : path.join(__dirname, 'rafiq.db');

// Database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS testimonies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('delay', 'medication', 'treatment', 'other')),
    message TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT (date('now')),
    likes INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    cancer_type TEXT NOT NULL,
    message TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL DEFAULT (date('now')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert sample data if empty
const count = db.prepare('SELECT COUNT(*) as c FROM testimonies').get();
if (count.c === 0) {
  const insert = db.prepare('INSERT INTO testimonies (name, wilaya, category, message, date, likes) VALUES (?, ?, ?, ?, ?, ?)');
  const samples = [
    ['سفيان', 'سطيف', 'delay', 'عندي 4 أشهر وأنا نستنى في الراديوتيرابي في سطيف. كل مرة يقولولي الشهر الجاي. المرض ما يستناش!', '2025-05-08', 24],
    ['خديجة', 'الجزائر', 'medication', 'نبحث عن دواء Fortimel لماما مريضة بسرطان المعدة. مش موجود في الصيدليات من شهرين. إذا حد يعرف وين، ساعدونا.', '2025-05-07', 18],
    ['محمد', 'وهران', 'delay', 'موعد الجراحة تأجل 3 مرات في CHU وهران. 6 أشهر نستنى والورم يكبر. وين حقوقنا؟', '2025-05-06', 31],
    ['فاطمة', 'قسنطينة', 'medication', 'دواء Herceptin غير متوفر من 3 أسابيع في قسنطينة. بنتي تحتاجه كل 21 يوم. اللي عنده معلومة يفيدنا.', '2025-05-05', 27],
    ['عبد الرحمان', 'باتنة', 'treatment', 'جهاز الأشعة في باتنة معطّل من شهر. كل المرضى يتنقلو لسطيف أو قسنطينة. التنقل صعيب على المريض.', '2025-05-04', 42],
    ['نورة', 'تيزي وزو', 'other', 'ما كاينش أخصائي نفسي في مركز السرطان تاعنا. المرضى يحتاجو دعم نفسي مش غير دواء.', '2025-05-03', 15],
  ];
  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });
  insertMany(samples);
}

const storyCount = db.prepare('SELECT COUNT(*) as c FROM stories').get();
if (storyCount.c === 0) {
  const insertStory = db.prepare('INSERT INTO stories (name, age, cancer_type, message, likes, date) VALUES (?, ?, ?, ?, ?, ?)');
  const stories = [
    ['أم سارة', 45, 'سرطان الثدي', 'كنت خايفة بزاف أول مرة دخلت الكيماوي. اليوم، بعد سنتين، رجعت نعيش حياتي عادي. الخوف طبيعي، لكن المرض يتغلب عليه.', 24, '2025-05-01'],
    ['عمي محمد', 58, 'سرطان القولون', 'أصعب حاجة كانت الوحدة. ما كانش من يشرحلي واش راح يصرالي. نصيحتي: اسأل الطبيب، متخجلش.', 18, '2025-04-28'],
    ['نادية', 34, 'سرطان الغدة الدرقية', 'المرض علّمني نقدّر كل يوم. العلاج كان صعب لكن قصير. اليوم أنا بخير والحمد لله.', 31, '2025-04-25'],
    ['كريم', 27, 'لمفوما هودجكين', 'كان عمري 25 وقت عرفت. صدمة. لكن 6 أشهر كيماوي وشفيت. الحياة ما وقفتش.', 42, '2025-04-20'],
  ];
  const insertManyStories = db.transaction((rows) => {
    for (const row of rows) insertStory.run(...row);
  });
  insertManyStories(stories);
}

// Middleware - CORS for all origins (temporary fix)
app.use(cors());
app.use(express.json());

// API Routes

app.get('/api/testimonies', (req, res) => {
  const { category } = req.query;
  let rows;
  if (category && category !== 'all') {
    rows = db.prepare('SELECT * FROM testimonies WHERE category = ? ORDER BY id DESC').all(category);
  } else {
    rows = db.prepare('SELECT * FROM testimonies ORDER BY id DESC').all();
  }
  res.json(rows);
});

app.get('/api/testimonies/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM testimonies').get().c;
  const delay = db.prepare("SELECT COUNT(*) as c FROM testimonies WHERE category = 'delay'").get().c;
  const medication = db.prepare("SELECT COUNT(*) as c FROM testimonies WHERE category = 'medication'").get().c;
  res.json({ total, delay, medication });
});

app.post('/api/testimonies', (req, res) => {
  const { name, wilaya, category, message } = req.body;
  if (!name || !wilaya || !category || !message) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  }
  const result = db.prepare(
    "INSERT INTO testimonies (name, wilaya, category, message, date) VALUES (?, ?, ?, ?, date('now'))"
  ).run(name.trim(), wilaya, category, message.trim());
  const newRow = db.prepare('SELECT * FROM testimonies WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newRow);
});

app.post('/api/testimonies/:id/like', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE testimonies SET likes = likes + 1 WHERE id = ?').run(id);
  const row = db.prepare('SELECT * FROM testimonies WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'غير موجود' });
  res.json(row);
});

app.get('/api/stories', (req, res) => {
  const rows = db.prepare('SELECT * FROM stories ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/stories', (req, res) => {
  const { name, age, cancer_type, message } = req.body;
  if (!name || !cancer_type || !message) {
    return res.status(400).json({ error: 'الاسم، نوع السرطان، والرسالة مطلوبين' });
  }
  const result = db.prepare(
    "INSERT INTO stories (name, age, cancer_type, message, date) VALUES (?, ?, ?, ?, date('now'))"
  ).run(name.trim(), age || null, cancer_type.trim(), message.trim());
  const newRow = db.prepare('SELECT * FROM stories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newRow);
});

app.post('/api/stories/:id/like', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE stories SET likes = likes + 1 WHERE id = ?').run(id);
  const row = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'غير موجود' });
  res.json(row);
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'rafiq', db: DB_PATH });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
