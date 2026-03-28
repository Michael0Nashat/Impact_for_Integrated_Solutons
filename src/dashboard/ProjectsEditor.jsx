import { useState } from 'react';
import { s } from './dashStyles';

const empty = { title: '', desc: '', category: '', img: '', status: '', work_type: '' };

export default function ProjectsEditor({ 
  projects, onAdd, onUpdate, onDelete, 
  token,
  defaultSystems = [], addDefaultSystem, deleteDefaultSystem
}) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imgPreview, setImgPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [newSystem, setNewSystem] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(empty); setImgPreview(''); setEditing(null); setUploadError(''); setShowModal(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title,
      desc: p.description ?? p.desc ?? '',
      category: p.category ?? '',
      img: p.img ?? '',
      status: p.status ?? '',
      work_type: p.work_type ?? ''
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

      {/* ─── Default Systems Section ─── */}
      <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid #334155' }}>
        <h2 style={s.sectionTitle}>⚙️ الأنظمة الافتراضية</h2>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>هذه الأنظمة تظهر تلقائياً للمشاريع التي لا تنتمي لتصنيف محدد.</p>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input 
            style={{ ...s.input, flex: 1, marginBottom: 0 }} 
            placeholder="أضف نظاماً جديداً (مثال: أنظمة التيار الخفيف)"
            value={newSystem}
            onChange={e => setNewSystem(e.target.value)}
          />
          <button 
            style={{ ...s.addBtn, margin: 0, padding: '0 24px' }}
            onClick={() => { if (newSystem.trim()) { addDefaultSystem(newSystem); setNewSystem(''); } }}
          >
            إضافة
          </button>
        </div>

        <div style={{ 
          background: '#1e293b', 
          borderRadius: 12, 
          overflow: 'hidden', 
          border: '1px solid #334155' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ background: '#334155', color: '#fff' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontSize: 14 }}>الاسم</th>
                <th style={{ padding: '12px 16px', fontSize: 14, width: 80 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {defaultSystems.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>لا توجد أنظمة مضافة حالياً.</td>
                </tr>
              ) : (
                defaultSystems.map(sys => (
                  <tr key={sys.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px 16px', color: '#f1f5f9', fontSize: 14 }}>{sys.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button 
                        onClick={() => deleteDefaultSystem(sys.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18 }}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
