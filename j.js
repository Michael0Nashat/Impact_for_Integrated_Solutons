import express from 'express';
import pg from 'pg';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'impact_jwt_secret_2024';

// Memory storage — Vercel's filesystem is read-only, so we can't write to disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

// Ensure tables exist (runs on cold start, safe to call repeatedly)
async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      category    TEXT,
      img         TEXT,
      status      TEXT,
      work_type   TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS default_systems (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS highlights (
      id    SERIAL PRIMARY KEY,
      label TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS login_logs (
      id         SERIAL PRIMARY KEY,
      username   TEXT,
      success    BOOLEAN NOT NULL,
      ip         TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS brands (
      id         SERIAL PRIMARY KEY,
      name       TEXT,
      img        TEXT,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS project_samples (
      id         SERIAL PRIMARY KEY,
      img        TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Migration to add columns if they don't exist
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS work_type TEXT;
  `);
}

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

/* ── CSP headers for all responses ── */
app.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self' https://vercel.live"
  );
  next();
});

/* ── Static uploads (local dev only — Vercel filesystem is read-only) ── */
// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

/* ── Health check ── */
app.get('/', (_req, res) => res.json({ status: 'ok' }));

/* ── Auth ── */

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
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

/* ── Upload image ── */
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const b64 = req.file.buffer.toString('base64');
  const url = `data:${req.file.mimetype};base64,${b64}`;
  res.json({ url });
});

/* ── Settings ── */

app.get('/api/settings/:key', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT value FROM settings WHERE key=$1', [req.params.key]);
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

/* ── Projects ── */

app.get('/api/projects', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { title, description, category, img, status, work_type } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO projects(title,description,category,img,status,work_type) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description, category, img, status, work_type]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { title, description, category, img, status, work_type } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET title=$1,description=$2,category=$3,img=$4,status=$5,work_type=$6 WHERE id=$7 RETURNING *`,
      [title, description, category, img, status, work_type, req.params.id]
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

/* ── Brands ── */

app.get('/api/brands', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM brands ORDER BY sort_order ASC, id ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/brands', authMiddleware, async (req, res) => {
  const { name, img, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO brands(name, img, sort_order) VALUES($1,$2,$3) RETURNING *',
      [name, img, sort_order ?? 0]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/brands/:id', authMiddleware, async (req, res) => {
  const { name, img, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE brands SET name=$1, img=$2, sort_order=$3 WHERE id=$4 RETURNING *',
      [name, img, sort_order ?? 0, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Brand not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/brands/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM brands WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Project Samples ── */

app.get('/api/project-samples', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM project_samples ORDER BY id ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/project-samples', authMiddleware, async (req, res) => {
  const { img } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO project_samples(img) VALUES($1) RETURNING *',
      [img]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/project-samples/:id', authMiddleware, async (req, res) => {
  const { img } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE project_samples SET img=$1 WHERE id=$2 RETURNING *',
      [img, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/project-samples/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM project_samples WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Default Systems ── */

app.get('/api/default-systems', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM default_systems ORDER BY id ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/default-systems', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO default_systems(name) VALUES($1) RETURNING *',
      [name]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/default-systems/:id', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE default_systems SET name=$1 WHERE id=$2 RETURNING *',
      [name, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/default-systems/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM default_systems WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Highlights ── */

app.get('/api/highlights', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM highlights ORDER BY id ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/highlights', authMiddleware, async (req, res) => {
  const { label } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO highlights(label) VALUES($1) RETURNING *',
      [label]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/highlights/:id', authMiddleware, async (req, res) => {
  const { label } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE highlights SET label=$1 WHERE id=$2 RETURNING *',
      [label, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/highlights/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM highlights WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Serverless export ── */
let initPromise = null;
export default async function handler(req, res) {
  if (!initPromise) initPromise = ensureTables().catch(e => { initPromise = null; throw e; });
  await initPromise;
  app(req, res);
}