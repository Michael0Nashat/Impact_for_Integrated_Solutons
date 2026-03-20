import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import pkg from 'pg';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const { Pool } = pkg;
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── DB ─────────────────────────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      img TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSONB
    );
  `);
}

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// ── Upload (Cloudinary) ────────────────────────────────────────────────────
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  try {
    const url = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'impact', resource_type: 'image' },
        (err, result) => err ? reject(err) : resolve(result.secure_url)
      );
      Readable.from(req.file.buffer).pipe(stream);
    });
    res.json({ url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// ── Projects ───────────────────────────────────────────────────────────────
app.get('/api/projects', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/projects', auth, async (req, res) => {
  const { title, description, category, img } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO projects (title, description, category, img) VALUES ($1,$2,$3,$4) RETURNING *',
    [title, description, category, img]
  );
  res.json(rows[0]);
});

app.put('/api/projects/:id', auth, async (req, res) => {
  const { title, description, category, img } = req.body;
  const { rows } = await pool.query(
    'UPDATE projects SET title=$1, description=$2, category=$3, img=$4 WHERE id=$5 RETURNING *',
    [title, description, category, img, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── Settings ───────────────────────────────────────────────────────────────
app.get('/api/settings/:key', async (req, res) => {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key=$1', [req.params.key]);
  res.json(rows[0]?.value ?? null);
});

app.put('/api/settings/:key', auth, async (req, res) => {
  await pool.query(
    'INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2',
    [req.params.key, JSON.stringify(req.body)]
  );
  res.json({ ok: true });
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1); });
