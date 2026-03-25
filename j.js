import express from 'express';
import pg from 'pg';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['https://impact-for-integrated-solutons.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dk9ss8rxl',
  api_key: process.env.CLOUDINARY_API_KEY || '754399178336668',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'o6VoomNTu_AB5k5EV-4fCAWSr24'
});

const JWT_SECRET = process.env.JWT_SECRET || 'impact_jwt_secret_2024';

// Memory storage with larger limit for videos
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { 
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  } 
});

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
      created_at  TIMESTAMPTZ DEFAULT NOW()
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
      video      TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
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
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com; connect-src 'self' https://vercel.live https://impact-for-integrated-solutons-serv.vercel.app"
  );
  // Add CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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

/* ── Upload image or video to Cloudinary ── */
app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const b64 = req.file.buffer.toString('base64');
    const isVideo = req.file.mimetype.startsWith('video/');
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${b64}`,
      {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'impact-solutions',
        transformation: isVideo ? [] : [
          { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
        ]
      }
    );

    res.json({ 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
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
      `UPDATE projects SET title=$1,description=$2,category=$3,img=$4 WHERE id=$5 RETURNING *`,
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
  const { img, video } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO project_samples(img, video) VALUES($1,$2) RETURNING *',
      [img, video]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/project-samples/:id', authMiddleware, async (req, res) => {
  const { img, video } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE project_samples SET img=$1, video=$2 WHERE id=$3 RETURNING *',
      [img, video, req.params.id]
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

/* ── Serverless export ── */
let initPromise = null;
export default async function handler(req, res) {
  if (!initPromise) initPromise = ensureTables().catch(e => { initPromise = null; throw e; });
  await initPromise;
  app(req, res);
}