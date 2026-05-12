const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'rafiq.db');

let db;

async function initDB() {
  const SQL = await initSqlJs();
  
  // Load existing DB or create new
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS testimonies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      wilaya TEXT NOT NULL,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      cancer_type TEXT NOT NULL,
      message TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert sample testimonies if empty
  const count = db.exec("SELECT COUNT(*) as c FROM testimonies")[0].values[0][0];
  if (count === 0) {
    const samples = [
      ['سفيان', 'سطيف', 'delay', 'عندي 4 أشهر وأنا نستنى في الراديوتيرابي في سطيف. كل مرة يقولولي الشهر الجاي. المرض ما يستناش!', '2025-05-08', 24],
      ['خديجة', 'الجزائر', 'medication', 'نبحث عن دواء Fortimel لماما مريضة بسرطان المعدة. مش موجود في الصيدليات من شهرين. إذا حد يعرف وين، ساعدونا.', '2025-05-07', 18],
      ['محمد', 'وهران', 'delay', 'موعد الجراحة تأجل 3 مرات في CHU وهران. 6 أشهر نستنى والورم يكبر. وين حقوقنا؟', '2025-05-06', 31],
      ['فاطمة', 'قسنطينة', 'medication', 'دواء Herceptin غير متوفر من 3 أسابيع في قسنطينة. بنتي تحتاجه كل 21 يوم. اللي عنده معلومة يفيدنا.', '2025-05-05', 27],
      ['عبد الرحمان', 'باتنة', 'treatment', 'جهاز الأشعة في باتنة معطّل من شهر. كل المرضى يتنقلو لسطيف أو قسنطينة. التنقل صعيب على المريض.', '2025-05-04', 42],
      ['نورة', 'تيزي وزو', 'other', 'ما كاينش أخصائي نفسي في مركز السرطان تاعنا. المرضى يحتاجو دعم نفسي مش غير دواء.', '2025-05-03', 15],
    ];
    for (const s of samples) {
      db.run("INSERT INTO testimonies (name, wilaya, category, message, date, likes) VALUES (?, ?, ?, ?, ?, ?)", s);
    }
  }

  // Insert sample stories if empty
  const storyCount = db.exec("SELECT COUNT(*) as c FROM stories")[0].values[0][0];
  if (storyCount === 0) {
    const stories = [
      ['أم سارة', 45, 'سرطان الثدي', 'كنت خايفة بزاف أول مرة دخلت الكيماوي. اليوم، بعد سنتين، رجعت نعيش حياتي عادي. الخوف طبيعي، لكن المرض يتغلب عليه.', 24, '2025-05-01'],
      ['عمي محمد', 58, 'سرطان القولون', 'أصعب حاجة كانت الوحدة. ما كانش من يشرحلي واش راح يصرالي. نصيحتي: اسأل الطبيب، متخجلش.', 18, '2025-04-28'],
      ['نادية', 34, 'سرطان الغدة الدرقية', 'المرض علّمني نقدّر كل يوم. العلاج كان صعب لكن قصير. اليوم أنا بخير والحمد لله.', 31, '2025-04-25'],
      ['كريم', 27, 'لمفوما هودجكين', 'كان عمري 25 وقت عرفت. صدمة. لكن 6 أشهر كيماوي وشفيت. الحياة ما وقفتش.', 42, '2025-04-20'],
    ];
    for (const s of stories) {
      db.run("INSERT INTO stories (name, age, cancer_type, message, likes, date) VALUES (?, ?, ?, ?, ?, ?)", s);
    }
  }

  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function getRows(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Middleware
app.use(cors());
app.use(express.json());

// ===== TESTIMONIES API =====

app.get('/api/testimonies', (req, res) => {
  const { category } = req.query;
  let rows;
  if (category && category !== 'all') {
    rows = getRows('SELECT * FROM testimonies WHERE category = ? ORDER BY id DESC', [category]);
  } else {
    rows = getRows('SELECT * FROM testimonies ORDER BY id DESC');
  }
  res.json(rows);
});

app.get('/api/testimonies/stats', (req, res) => {
  const total = db.exec("SELECT COUNT(*) FROM testimonies")[0].values[0][0];
  const delay = db.exec("SELECT COUNT(*) FROM testimonies WHERE category = 'delay'")[0].values[0][0];
  const medication = db.exec("SELECT COUNT(*) FROM testimonies WHERE category = 'medication'")[0].values[0][0];
  res.json({ total, delay, medication });
});

app.post('/api/testimonies', (req, res) => {
  const { name, wilaya, category, message } = req.body;
  if (!name || !wilaya || !category || !message) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  }
  const today = new Date().toISOString().split('T')[0];
  db.run("INSERT INTO testimonies (name, wilaya, category, message, date) VALUES (?, ?, ?, ?, ?)",
    [name.trim(), wilaya, category, message.trim(), today]);
  saveDB();
  const rows = getRows("SELECT * FROM testimonies ORDER BY id DESC LIMIT 1");
  res.status(201).json(rows[0]);
});

app.post('/api/testimonies/:id/like', (req, res) => {
  const { id } = req.params;
  db.run("UPDATE testimonies SET likes = likes + 1 WHERE id = ?", [Number(id)]);
  saveDB();
  const rows = getRows("SELECT * FROM testimonies WHERE id = ?", [Number(id)]);
  if (!rows.length) return res.status(404).json({ error: 'غير موجود' });
  res.json(rows[0]);
});

// ===== STORIES API =====

app.get('/api/stories', (req, res) => {
  const rows = getRows('SELECT * FROM stories ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/stories', (req, res) => {
  const { name, age, cancer_type, message } = req.body;
  if (!name || !cancer_type || !message) {
    return res.status(400).json({ error: 'الاسم، نوع السرطان، والرسالة مطلوبين' });
  }
  const today = new Date().toISOString().split('T')[0];
  db.run("INSERT INTO stories (name, age, cancer_type, message, date) VALUES (?, ?, ?, ?, ?)",
    [name.trim(), age || null, cancer_type.trim(), message.trim(), today]);
  saveDB();
  const rows = getRows("SELECT * FROM stories ORDER BY id DESC LIMIT 1");
  res.status(201).json(rows[0]);
});

app.post('/api/stories/:id/like', (req, res) => {
  const { id } = req.params;
  db.run("UPDATE stories SET likes = likes + 1 WHERE id = ?", [Number(id)]);
  saveDB();
  const rows = getRows("SELECT * FROM stories WHERE id = ?", [Number(id)]);
  if (!rows.length) return res.status(404).json({ error: 'غير موجود' });
  res.json(rows[0]);
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
