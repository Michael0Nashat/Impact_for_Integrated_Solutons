import { useState } from 'react';
import { s } from './dashStyles';
import { API } from './useDashboardData';

const empty = { title: '', desc: '', category: '', img: '' };

export default function ProjectsEditor({ projects, onAdd, onUpdate, onDelete, token }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imgPreview, setImgPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(empty); setImgPreview(''); setEditing(null); setUploadError(''); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ title: p.title, desc: p.description ?? p.desc ?? '', category: p.category ?? '', img: p.img ?? '' });
    setImgPreview(p.img ?? '');
    setEditing(Number(p.id));
    setUploadError('');
    setShowModal(true);
  };

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImgPreview(localUrl);
    setUploading(true);
    setUploadError('');
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
      URL.revokeObjectURL(localUrl);
      setImgPreview(data.url);
      set('img', data.url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || uploading) return;
    if (editing !== null) await onUpdate(editing, form);
    else await onAdd(form);
    setShowModal(false);
  };

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>🗂️ إدارة المشاريع</h2>
      <button style={s.addBtn} onClick={openAdd}>+ إضافة مشروع جديد</button>
      <div style={s.grid3}>
        {projects.map(p => (
          <div key={p.id} style={s.card}>
            {p.img && <img src={p.img} alt={p.title} style={s.cardImg} />}
            <div style={s.cardBody}>
              <p style={s.cardTitle}>{p.title}</p>
              <p style={s.cardDesc}>
                {(p.description ?? p.desc ?? '').slice(0, 80)}
                {(p.description ?? p.desc ?? '').length > 80 ? '...' : ''}
              </p>
              {p.category && <span style={s.badge}>{p.category}</span>}
              <div style={s.cardActions}>
                <button style={s.editBtn} onClick={() => openEdit(p)}>✏️ تعديل</button>
                <button style={s.deleteBtn} onClick={() => onDelete(p.id)}>🗑️ حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modalBox}>
            <h3 style={s.modalTitle}>{editing !== null ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h3>

            <label style={s.label}>اسم المشروع *</label>
            <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} />

            <label style={s.label}>الوصف</label>
            <textarea style={s.textarea} value={form.desc} onChange={e => set('desc', e.target.value)} rows={4} />

            <label style={s.label}>التصنيف</label>
            <input style={s.input} value={form.category} onChange={e => set('category', e.target.value)} />
            
            <input type="file" accept="image/*" onChange={handleImg} style={s.fileInput} disabled={uploading} />
            {uploading && <p style={{ color: '#ffc107', fontSize: 13 }}>⏳ جاري رفع الصورة...</p>}
            {uploadError && <p style={{ color: '#f87171', fontSize: 13 }}>❌ {uploadError}</p>}
            {imgPreview && (
              <img src={imgPreview} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10 }} />
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.saveBtn} onClick={handleSubmit} disabled={uploading}>
                {editing !== null ? 'حفظ التعديل' : 'إضافة'}
              </button>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
