import { useState } from 'react';
import { s } from './dashStyles';

export default function AboutEditor({ about, onSave, token }) {
  const [form, setForm] = useState({ ...about });
  const [imgPreview, setImgPreview] = useState(about.image);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        const MAX_WIDTH = 1200; 
        const MAX_HEIGHT = 1200;

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
