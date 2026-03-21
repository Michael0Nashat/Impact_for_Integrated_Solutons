import { useState, useEffect } from 'react';
import { s } from './dashStyles';
import { API } from './useDashboardData';

export default function BrandsEditor({ token }) {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', img: '', sort_order: 0 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchBrands(); }, []);

  async function fetchBrands() {
    const r = await fetch(`${API}/brands`);
    const data = await r.json();
    if (Array.isArray(data)) setBrands(data);
  }

  function startEdit(brand) {
    setEditId(brand.id);
    setForm({ name: brand.name || '', img: brand.img || '', sort_order: brand.sort_order ?? 0 });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ name: '', logo_url: '', sort_order: 0 });
  }

  async function uploadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, img: url }));
    } catch (err) {
      setMsg('خطأ في الرفع: ' + err.message);
    }
    setLoading(false);
  }

  async function save() {
    if (!form.img) return setMsg('يرجى رفع صورة');
    setLoading(true);
    try {
      const url = editId ? `${API}/brands/${editId}` : `${API}/brands`;
      const method = editId ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!r.ok) throw new Error(await r.text());
      setMsg(editId ? 'تم التحديث' : 'تمت الإضافة');
      cancelEdit();
      fetchBrands();
    } catch (e) {
      setMsg('خطأ: ' + e.message);
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function deleteBrand(id) {
    if (!confirm('حذف هذه العلامة التجارية؟')) return;
    await fetch(`${API}/brands/${id}`, { method: 'DELETE', headers });
    fetchBrands();
  }

  return (
    <div>
      <div style={s.sectionTitle}>العلامات التجارية</div>

      {/* Form */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 28, border: '1px solid #334155' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <div style={s.label}>اسم العلامة</div>
            <input style={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="مثال: Bosch" />
          </div>
          <div>
            <div style={s.label}>الترتيب</div>
            <input style={{ ...s.input, width: 70 }} type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={s.label}>الشعار</div>
          <input type="file" accept="image/*" style={s.fileInput} onChange={handleFileChange} disabled={loading} />
        </div>

        {form.img && (
          <div style={{ marginTop: 12 }}>
            <img src={form.img} alt="preview" style={{ height: 80, objectFit: 'contain', background: '#0f172a', borderRadius: 8, padding: 8 }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button style={s.saveBtn} onClick={save} disabled={loading}>
            {loading ? '...' : editId ? 'تحديث' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={cancelEdit} style={{ ...s.saveBtn, background: '#334155', color: '#fff' }}>إلغاء</button>
          )}
        </div>
        {msg && <div style={{ marginTop: 10, color: msg.startsWith('خطأ') ? '#f87171' : '#4ade80', fontSize: 14 }}>{msg}</div>}
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
        {brands.map(brand => (
          <div key={brand.id} style={{ ...s.card, padding: 12, textAlign: 'center' }}>
            <img src={brand.img} alt={brand.name} style={{ width: '100%', height: 80, objectFit: 'contain', background: '#0f172a', borderRadius: 8, padding: 6 }} />
            <div style={{ color: '#fff', fontSize: 13, marginTop: 8, marginBottom: 4 }}>{brand.name || '—'}</div>
            <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10 }}>ترتيب: {brand.sort_order}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button onClick={() => startEdit(brand)} style={{ padding: '4px 10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>تعديل</button>
              <button onClick={() => deleteBrand(brand.id)} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>حذف</button>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>لا توجد علامات تجارية بعد. أضف أولى!</div>
      )}
    </div>
  );
}
