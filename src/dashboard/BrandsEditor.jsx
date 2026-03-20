import { useState } from 'react';
import { API } from './useDashboardData';

export default function BrandsEditor({ brands, onAdd, onUpdate, onDelete, token }) {
  const [newUrl, setNewUrl] = useState('');
  const [editId, setEditId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file, onDone) => {
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      onDone(data.url);
    } catch (e) {
      alert('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    await onAdd(newUrl.trim());
    setNewUrl('');
  };

  const handleSaveEdit = async () => {
    if (!editUrl.trim()) return;
    await onUpdate(editId, editUrl.trim());
    setEditId(null);
    setEditUrl('');
  };

  return (
    <div style={{ color: '#fff' }}>
      <h2 style={{ marginBottom: 24, color: '#ffc107' }}>علامات تجارية</h2>

      {/* Add new brand */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="رابط الصورة أو ارفع صورة"
          style={inputStyle}
        />
        <label style={uploadBtnStyle}>
          {uploading ? 'جاري الرفع...' : '📁 رفع صورة'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && uploadImage(e.target.files[0], url => setNewUrl(url))}
          />
        </label>
        <button onClick={handleAdd} style={addBtnStyle} disabled={!newUrl.trim()}>
          + إضافة
        </button>
      </div>

      {/* Brands grid */}
      {brands.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>لا توجد علامات تجارية بعد.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
          {brands.map(brand => (
            <div key={brand.id} style={cardStyle}>
              {editId === brand.id ? (
                <>
                  <input
                    value={editUrl}
                    onChange={e => setEditUrl(e.target.value)}
                    style={{ ...inputStyle, marginBottom: 8, width: '100%' }}
                  />
                  <label style={{ ...uploadBtnStyle, width: '100%', textAlign: 'center', marginBottom: 8 }}>
                    {uploading ? '...' : '📁 رفع'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => e.target.files[0] && uploadImage(e.target.files[0], url => setEditUrl(url))}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={handleSaveEdit} style={saveBtnStyle}>حفظ</button>
                    <button onClick={() => setEditId(null)} style={cancelBtnStyle}>إلغاء</button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={brand.images?.startsWith('/uploads') ? `https://impact-for-integrated-solutons-serv.vercel.app${brand.images}` : brand.images}
                    alt="brand"
                    style={{ width: '100%', height: 100, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 8 }}
                  />
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button onClick={() => { setEditId(brand.id); setEditUrl(brand.images); }} style={editBtnStyle}>✏️ تعديل</button>
                    <button onClick={() => onDelete(brand.id)} style={deleteBtnStyle}>🗑️ حذف</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 14, flex: 1, minWidth: 200 };
const uploadBtnStyle = { padding: '10px 16px', background: '#334155', color: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 14 };
const addBtnStyle = { padding: '10px 20px', background: '#ffc107', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 };
const cardStyle = { background: '#1e293b', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 };
const editBtnStyle = { flex: 1, padding: '6px 0', background: '#334155', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 };
const deleteBtnStyle = { flex: 1, padding: '6px 0', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 };
const saveBtnStyle = { flex: 1, padding: '6px 0', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 };
const cancelBtnStyle = { flex: 1, padding: '6px 0', background: '#475569', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 };
