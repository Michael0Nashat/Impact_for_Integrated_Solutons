import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'impact_jwt_secret_2024';

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/* ── Auth ────────────────────────────────────────────────────────────────── */

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const success = username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS;
  try {
    await pool.query(
      'INSERT INTO login_logs(username, success, ip) VALUES($1,$2,$3)',
      [username, success, ip]
    );
  } catch (e) { console.error('login log error:', e.message); }
  if (success) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
});

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key  TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS projects (
      id         SERIAL PRIMARY KEY,
      title      TEXT NOT NULL,
      description TEXT,
      category   TEXT,
      img        TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_logs (
      id         SERIAL PRIMARY KEY,
      username   TEXT,
      success    BOOLEAN NOT NULL,
      ip         TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed default projects if table is empty
  const { rows } = await pool.query('SELECT COUNT(*) FROM projects');
  if (parseInt(rows[0].count) === 0) {
    const defaults = [
      { title: 'وزارة الداخلية', description: 'نظام كاميرات المراقبة – قسم شرطة أم دومة بسوهاج. نظام إنذار الحريق – قسم شرطة سنباط بالغربية.', category: 'حكومي', img: '/dsd.jpg' },
      { title: 'مستشفى النيل بدراوي المعادي', description: 'تنفيذ جميع انظمة التيار الخفيف من البنية التحتية لكبلات النحاس و الفايبر', category: 'صحي', img: '/IMG-20260314-WA0036.jpg' },
      { title: 'مصنع أندريا وجورج للذهب', description: 'تنفيذ جميع أنظمة التيار الخفيف من مرحلة الأعمال التأسيسية حتى مرحلة التشغيل', category: 'صناعي', img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334' },
      { title: 'مجمع تجاري - سيتي سنتر', description: 'تنفيذ أنظمة التيار الخفيف الشاملة للمباني التجارية', category: 'تجاري', img: '/IMG-20260314-WA0034.jpg' },
      { title: 'مقر شركة الاتصالات', description: 'تركيب أنظمة الأمن والمراقبة المتطورة مع نظام التحكم في الدخول', category: 'إداري', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c' },
      { title: 'مصنع الأدوية الحديث', description: 'حلول متكاملة للأنظمة الذكية في المصانع', category: 'صناعي', img: '/IMG-20260314-WA0035.jpg' },
    ];
    for (const p of defaults) {
      await pool.query(
        'INSERT INTO projects(title,description,category,img) VALUES($1,$2,$3,$4)',
        [p.title, p.description, p.category, p.img]
      );
    }
    console.log('✅ Default projects seeded');
  }

  console.log('✅ DB tables ready');
}

/* ── Upload image ────────────────────────────────────────────────────────── */

app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

/* ── Settings: hero / about ─────────────────────────────────────────────── */

app.get('/api/settings/:key', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT value FROM settings WHERE key=$1', [req.params.key]
    );
    res.json(rows[0]?.value ?? null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/settings/:key', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO settings(key,value) VALUES($1,$2)
       ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value`,
      [req.params.key, req.body]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Projects ────────────────────────────────────────────────────────────── */

app.get('/api/projects', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { title, description, category, img } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO projects(title,description,category,img) VALUES($1,$2,$3,$4) RETURNING *',
      [title, description, category, img]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { title, description, category, img } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET title=$1,description=$2,category=$3,img=$4
       WHERE id=$5 RETURNING *`,
      [title, description, category, img, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3001;
initDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`))
);
