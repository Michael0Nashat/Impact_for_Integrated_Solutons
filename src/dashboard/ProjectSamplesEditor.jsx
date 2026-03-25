import { useState, useEffect } from 'react';
import { s } from './dashStyles';
import { API } from './useDashboardData';

export default function ProjectSamplesEditor({ token }) {
  const [samples, setSamples] = useState([]);
  const [form, setForm] = useState({ img: '', video: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchSamples(); }, []);

  async function fetchSamples() {
    const r = await fetch(`${API}/project-samples`);
    const data = await r.json();
    if (Array.isArray(data)) setSamples(data);
  }

  function startEdit(item) {
    setEditId(item.id);
    setForm({ img: item.img || '', video: item.video || '' });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ img: '', video: '' });
  }

  async function handleFileChange(e, type) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    
    // Upload to Cloudinary first
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setForm(f => ({ ...f, [type]: data.url }));
      setMsg(`تم تحميل ${type === 'video' ? 'الفيديو' : 'الصورة'} بنجاح`);
    } catch (error) {
      setMsg('فشل التحميل: ' + error.message);
    }
    setLoading(false);
  }

  async function save() {
    if (!form.img && !form.video) return setMsg('يرجى رفع صورة أو فيديو');
    setLoading(true);
    try {
      const url = editId ? `${API}/project-samples/${editId}` : `${API}/project-samples`;
      const method = editId ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!r.ok) throw new Error(await r.text());
      setMsg(editId ? 'تم التحديث' : 'تمت الإضافة');
      cancelEdit();
      fetchSamples();
    } catch (e) {
      setMsg('خطأ: ' + e.message);
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function deleteSample(id) {
    if (!confirm('حذف هذه الصورة؟')) return;
    await fetch(`${API}/project-samples/${id}`, { method: 'DELETE', headers });
    fetchSamples();
  }

  return (
    <div>
      <div style={s.sectionTitle}>أمثلة من مشاريعنا</div>

      {/* Form */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 28, border: '1px solid #334155' }}>
        <div style={{ marginTop: 12 }}>
          <div style={s.label}>صورة المشروع</div>
          <input type="file" accept="image/*" style={s.fileInput} onChange={(e) => handleFileChange(e, 'img')} disabled={loading} />
        </div>

        {form.img && (
          <div style={{ marginTop: 12 }}>
            <img src={form.img} alt="preview" style={{ height: 100, objectFit: 'cover', borderRadius: 8 }} />
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <div style={s.label}>فيديو المشروع</div>
          <input type="file" accept="video/*" style={s.fileInput} onChange={(e) => handleFileChange(e, 'video')} disabled={loading} />
        </div>

        {form.video && (
          <div style={{ marginTop: 12 }}>
            <video src={form.video} controls style={{ height: 100, borderRadius: 8 }} />
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

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155' }}>
              <th style={th}>#</th>
              <th style={th}>الصورة</th>
              <th style={th}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? '#0f172a' : '#111827' }}>
                <td style={td}>{item.id}</td>
                <td style={td}>
                  {item.img && (
                    <img src={item.img} alt={`sample-${item.id}`} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                  )}
                  {item.video && (
                    <video src={item.video} controls style={{ width: 80, height: 60, borderRadius: 6, marginTop: item.img ? '8px' : '0' }} />
                  )}
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(item)} style={{ padding: '4px 10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>تعديل</button>
                    <button onClick={() => deleteSample(item.id)} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {samples.length === 0 && (
          <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>لا توجد صور بعد. أضف أولى!</div>
        )}
      </div>
    </div>
  );
}

const th = { padding: '10px 14px', textAlign: 'right', color: '#94a3b8', fontWeight: 600 };
const td = { padding: '10px 14px', textAlign: 'right', verticalAlign: 'middle' };
