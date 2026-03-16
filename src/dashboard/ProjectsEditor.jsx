import { useState } from 'react';
import { s } from './dashStyles';
import { allProjects } from '../data/defaultProjects';

const empty = { title: '', desc: '', category: '', img: '', imgFile: null };

export default function ProjectsEditor({ projects, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, id = edit
  const [form, setForm] = useState(empty);
  const [imgPreview, setImgPreview] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(empty); setImgPreview(''); setEditing(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ title: p.title, desc: p.desc, category: p.category, img: p.img }); setImgPreview(p.img); setEditing(p.id); setShowModal(true); };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgPreview(url);
    set('img', url);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editing !== null) onUpdate(editing, form);
    else onAdd(form);
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
              <p style={s.cardDesc}>{p.desc?.slice(0, 80)}{p.desc?.length > 80 ? '...' : ''}</p>
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
            <label style={s.label}>رابط الصورة (أو ارفع صورة)</label>
            <input style={s.input} value={form.img} onChange={e => { set('img', e.target.value); setImgPreview(e.target.value); }} dir="ltr" placeholder="https://..." />
            <input type="file" accept="image/*" onChange={handleImg} style={s.fileInput} />
            {imgPreview && <img src={imgPreview} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10 }} />}
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.saveBtn} onClick={handleSubmit}>{editing !== null ? 'حفظ التعديل' : 'إضافة'}</button>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
