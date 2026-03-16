import { useState } from 'react';
import { s } from './dashStyles';

export default function HeroEditor({ hero, onSave }) {
  const [form, setForm] = useState({ ...hero });
  const [saved, setSaved] = useState(false);
  const [imgPreview, setImgPreview] = useState(hero.image);

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
      <h2 style={s.sectionTitle}>✏️ تعديل القسم الرئيسي (Hero)</h2>
      <div style={s.grid2}>
        <div style={s.formCol}>
          <label style={s.label}>العنوان الرئيسي</label>
          <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} />

          <label style={s.label}>النص التوضيحي</label>
          <textarea style={s.textarea} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} rows={3} />

          <label style={s.label}>نص الزر</label>
          <input style={s.input} value={form.btnText} onChange={e => set('btnText', e.target.value)} />

          <label style={s.label}>رابط الزر</label>
          <input style={s.input} value={form.btnLink} onChange={e => set('btnLink', e.target.value)} dir="ltr" />

          <label style={s.label}>رفع صورة جديدة</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={s.fileInput} />

          <button onClick={handleSave} style={s.saveBtn}>
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
