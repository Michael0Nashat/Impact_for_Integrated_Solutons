import { useState, useRef } from 'react';
import { API } from './useDashboardData';

export default function BrandsEditor({ brands, onAdd, onDelete, token }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview({ file, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!preview?.file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', preview.file);
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      await onAdd(url);
    } catch (e) {
      console.error('BrandsEditor upload error:', e.message);
    }
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
    setUploading(false);
  };

  return (
    <div style={{ color: '#fff' }}>
      <h2 style={{ marginBottom: 24, color: '#ffc107' }}>علامات تجارية</h2>

      {/* Upload */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16, color: '#94a3b8' }}>إضافة علامة تجارية</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ color: '#fff' }}
          />
          {preview && (
            <img src={preview.dataUrl} alt="preview" style={{ width: 80, height: 80, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 4 }} />
          )}
          <button
            onClick={handleAdd}
            disabled={!preview || uploading}
            style={{ padding: '10px 24px', background: uploading ? '#555' : '#ffc107', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
          >
            {uploading ? 'جاري الحفظ...' : 'إضافة'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
        {brands.map(brand => (
          <div key={brand.id} style={{ background: '#1e293b', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <img
              src={brand.images}
              alt={`brand-${brand.id}`}
              style={{ width: 90, height: 90, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 4 }}
            />
            <button
              onClick={() => onDelete(brand.id)}
              style={{ padding: '4px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
            >
              حذف
            </button>
          </div>
        ))}
        {brands.length === 0 && (
          <p style={{ color: '#64748b', gridColumn: '1/-1' }}>لا توجد علامات تجارية بعد.</p>
        )}
      </div>
    </div>
  );
}
