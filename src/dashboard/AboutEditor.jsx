import { useState } from 'react';
import { s } from './dashStyles';

export default function AboutEditor({ about, onSave }) {
  const [form, setForm] = useState({ ...about });
  const [saved, setSaved] = useState(false);
  const [imgPreview, setImgPreview] = useState(about.image);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgPreview(url);
    set('image', url);
  };

  const handleSave = () => {
    onSave(form);
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
          <input type="file" accept="image/*" onChange={handleImageUpload} style={s.fileInput} />

          <button onClick={handleSave} style={s.saveBtn}>
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
