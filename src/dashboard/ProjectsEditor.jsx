import { useState } from 'react';
import { s } from './dashStyles';

const empty = { title: '', desc: '', category: '', img: '', status: 'مكتمل ✅', work_type: 'تيار خفيف وأنظمة ذكية' };

export default function ProjectsEditor({ 
  projects, onAdd, onUpdate, onDelete, 
  defaultSystems = [], addDefaultSystem, deleteDefaultSystem,
  highlights = [], addHighlight, deleteHighlight,
  token 
}) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imgPreview, setImgPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [newSystem, setNewSystem] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(empty); setImgPreview(''); setEditing(null); setUploadError(''); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ 
      title: p.title, 
      desc: p.description ?? p.desc ?? '', 
      category: p.category ?? '', 
      img: p.img ?? '',
      status: p.status ?? 'مكتمل ✅',
      work_type: p.work_type ?? 'تيار خفيف وأنظمة ذكية'
    });
    setImgPreview(p.img ?? '');
    setEditing(Number(p.id));
    setUploadError('');
    setShowModal(true);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setImgPreview(base64);
      set('img', base64);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadError('فشل قراءة الصورة');
      setUploading(false);
    };
    reader.readAsDataURL(file);
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

      <div style={{ marginTop: 40, borderTop: '1px solid #334155', paddingTop: 24 }}>
        <h2 style={s.sectionTitle}>🛠️ إدارة الأنظمة الافتراضية</h2>
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input 
            style={s.input} 
            placeholder="اسم نظام جديد" 
            value={newSystem} 
            onChange={e => setNewSystem(e.target.value)} 
          />
          <button style={s.addBtn} onClick={() => { addDefaultSystem(newSystem); setNewSystem(''); }}>إضافة</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {defaultSystems.map(sys => (
            <div key={sys.id} style={{ ...s.badge, display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px' }}>
              {sys.name}
              <span 
                style={{ cursor: 'pointer', color: '#ff4444', fontWeight: 'bold' }} 
                onClick={() => deleteDefaultSystem(sys.id)}
              >×</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 40, borderTop: '1px solid #334155', paddingTop: 24 }}>
        <h2 style={s.sectionTitle}>✨ إدارة مميزات العمل (Highlights)</h2>
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input 
            style={s.input} 
            placeholder="نص ميزة جديدة" 
            value={newHighlight} 
            onChange={e => setNewHighlight(e.target.value)} 
          />
          <button style={s.addBtn} onClick={() => { addHighlight(newHighlight); setNewHighlight(''); }}>إضافة</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {highlights.map(h => (
            <div key={h.id} style={{ ...s.badge, display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: '#3b82f6' }}>
              {h.label}
              <span 
                style={{ cursor: 'pointer', color: '#ff4444', fontWeight: 'bold' }} 
                onClick={() => deleteHighlight(h.id)}
              >×</span>
            </div>
          ))}
        </div>
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

            <label style={s.label}>حالة المشروع</label>
            <input style={s.input} value={form.status} onChange={e => set('status', e.target.value)} />

            <label style={s.label}>نوع العمل</label>
            <input style={s.input} value={form.work_type} onChange={e => set('work_type', e.target.value)} />
            
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
