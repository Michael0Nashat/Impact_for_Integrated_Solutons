import { useState, useEffect } from 'react';
import { s } from './dashStyles';

export default function HeroEditor({ hero, onSave, token }) {
  const [form, setForm] = useState({ ...hero });
  const [imgPreview, setImgPreview] = useState(hero.image);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  // sync form when hero loads from server
  useEffect(() => {
    setForm({ ...hero });
    setImgPreview(hero.image);
  }, [hero]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('الملف كبير جداً (أقصى حد 10MB)');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1920; 
        const MAX_HEIGHT = 1080;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setImgPreview(compressedBase64);
        set('image', compressedBase64);
        setUploading(false);
      };
      img.onerror = () => {
        alert('خطأ في تحميل الصورة');
        setUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
