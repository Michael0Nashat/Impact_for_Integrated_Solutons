import { useState } from 'react';
import { s } from './dashStyles';

const empty = { title: '', desc: '', category: '', img: '', status: '', work_type: '', systems: [] };

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
      work_type: p.work_type ?? '',
      systems: Array.isArray(p.systems) ? p.systems : []
    });
    setImgPreview(p.img ?? '');
    setEditing(Number(p.id));
    setUploadError('');
    setShowModal(true);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      return setUploadError('الملف كبير جداً (أقصى حد 10MB)');
    }

    setUploading(true);
    setUploadError('');
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

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImgPreview(compressedBase64);
        set('img', compressedBase64);
        setUploading(false);
      };
      img.onerror = () => {
        setUploadError('خطأ في تحميل الصورة');
        setUploading(false);
      };
      img.src = event.target.result;
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

            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>الأنظمة المنفذة</label>
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                gap: 8, background: '#1e293b', padding: 12, borderRadius: 10, border: '1px solid #334155' 
              }}>
                {defaultSystems.map(sys => (
                  <label key={sys.id} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f1f5f9', fontSize: 13, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.systems?.includes(sys.name)} 
                      onChange={e => {
                        const next = e.target.checked 
                          ? [...(form.systems || []), sys.name]
                          : (form.systems || []).filter(x => x !== sys.name);
                        set('systems', next);
                      }} 
                    />
                    {sys.name}
                  </label>
                ))}
                {(form.systems || []).filter(s => !defaultSystems.find(ds => ds.name === s)).map(sys => (
                  <label key={sys} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 13, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={true} 
                      onChange={() => {
                        const next = (form.systems || []).filter(x => x !== sys);
                        set('systems', next);
                      }} 
                    />
                    {sys} (إضافي)
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input 
                  style={{ ...s.input, marginBottom: 0, flex: 1, fontSize: 12, padding: '6px 10px' }} 
                  placeholder="أضف نظاماً مخصصاً لهذا المشروع"
                  id="customSystemInput"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !form.systems?.includes(val)) {
                        set('systems', [...(form.systems || []), val]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button 
                  style={{ ...s.addBtn, margin: 0, padding: '0 12px', fontSize: 12 }}
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById('customSystemInput');
                    const val = input.value.trim();
                    if (val && !form.systems?.includes(val)) {
                      set('systems', [...(form.systems || []), val]);
                      input.value = '';
                    }
                  }}
                >
                  إضافة
                </button>
              </div>
            </div>

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
