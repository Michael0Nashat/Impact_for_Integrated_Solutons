import { useState } from 'react';
import { s } from './dashStyles';
import { API } from './useDashboardData';

export default function AboutEditor({ about, onSave, token }) {
  const [form, setForm] = useState({ ...about });
  const [imgPreview, setImgPreview] = useState(about.image);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgPreview(URL.createObjectURL(file));
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImgPreview(data.url);
      set('image', data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await onSave(form);
    window.dispatchEvent(new Event('about-updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>✏️ تعديل قسم "من نحن" (About)</h2>
      <div style={s.grid2}>
        <div style={s.formCol}>
          <label style={s.label}>العنوان</label>
          <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} />

          <label style={s.label}>النص</label>
          <textarea style={s.textarea} value={form.text} onChange={e => set('text', e.target.value)} rows={6} />

          <label style={s.label}>رفع صورة جديدة</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={s.fileInput} disabled={uploading} />
          {uploading && <p style={{ color: '#ffc107', fontSize: 13 }}>⏳ جاري رفع الصورة...</p>}
          {error && <p style={{ color: '#f87171', fontSize: 13 }}>❌ {error}</p>}

          <button onClick={handleSave} style={s.saveBtn} disabled={uploading}>
            {saved ? '✅ تم الحفظ' : 'حفظ التغييرات'}
          </button>
        </div>
        <div style={s.previewCol}>
          <p style={s.label}>معاينة الصورة</p>
          <img src={imgPreview} alt="about preview" style={s.previewImg} />
          <div style={s.previewBox}>
            <h3 style={{ color: '#ffc107', marginBottom: 8 }}>{form.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8 }}>{form.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
