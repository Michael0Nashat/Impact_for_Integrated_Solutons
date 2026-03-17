import { useState, useEffect } from 'react';
import { s } from './dashStyles';
import { API } from './useDashboardData';

export default function HeroEditor({ hero, onSave, token }) {
  const [form, setForm] = useState({ ...hero });
  const [imgPreview, setImgPreview] = useState(hero.image);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // sync form when hero loads from server
  useEffect(() => {
    setForm({ ...hero });
    setImgPreview(hero.image);
  }, [hero]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // show local preview immediately
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
    window.dispatchEvent(new Event('hero-updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>✏️ تعديل القسم الرئيسي (Hero)</h2>
      <div style={s.grid2}>
        <div style={s.formCol}>
          <label style={s.label}>العنوان الرئيسي</label>
          <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} />

          <label style={s.label}>النص التوضيحي</label>
          <textarea style={s.textarea} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} rows={3} />

          <label style={s.label}>نص الزر</label>
          <input style={s.input} value={form.btnText} onChange={e => set('btnText', e.target.value)} />

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
          <img src={imgPreview} alt="hero preview" style={s.previewImg} />
          <div style={s.previewBox}>
            <h3 style={{ color: '#ffc107', marginBottom: 8 }}>{form.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{form.subtitle}</p>
            <span style={s.previewBtn}>{form.btnText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
