import { useState, useEffect } from 'react';

const API_BASE = 'https://impact-for-integrated-solutons-serv.vercel.app/api/contacts';

const emptyForm = () => ({
  addresses: [''],
  phones: [''],
  emails: [''],
});

function contactToForm(c) {
  if (!c) return emptyForm();
  return {
    addresses: c.addresses?.length ? c.addresses : [c.address || ''],
    phones: c.phones?.length ? c.phones : [c.phone || ''],
    emails: c.emails?.length ? c.emails : [c.email || ''],
  };
}

function formToPayload(form) {
  const addresses = form.addresses.map(v => v.trim()).filter(Boolean);
  const phones = form.phones.map(v => v.trim()).filter(Boolean);
  const emails = form.emails.map(v => v.trim()).filter(Boolean);

  return {
    addresses,
    phones,
    emails,
    // legacy fields for backward compatibility with the current backend schema
    address: addresses[0] || '',
    phone: phones[0] || '',
    email: emails[0] || '',
  };
}

export default function ContactEditor({ token }) {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);

  async function fetchContact() {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const first = rows[0];
        setContact(first);
        setForm(contactToForm(first));
      } else {
        setContact(null);
        setForm(emptyForm());
      }
    } catch (e) {
      console.error('Failed to load contact info:', e);
    } finally {
      setLoading(false);
    }
  }

  function updateItem(field, index, value) {
    setForm(prev => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  }

  function addItem(field) {
    setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  }

  function removeItem(field, index) {
    setForm(prev => {
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list.length ? list : [''] };
    });
  }

  function startEdit() {
    setForm(contactToForm(contact));
    setIsEditing(true);
  }

  function cancelEdit() {
    setForm(contactToForm(contact));
    setIsEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const isUpdate = !!contact;
      const url = isUpdate ? `${API_BASE}/${contact.id}` : API_BASE;
      const method = isUpdate ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'فشل الحفظ');
      }
      const saved = await res.json();
      setContact(saved);
      setForm(contactToForm(saved));
      setMessage('تم الحفظ بنجاح ✅');
      setIsEditing(false);
    } catch (e) {
      setMessage(`خطأ: ${e.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function handleDelete() {
    if (!contact) return;
    const confirmed = window.confirm('هل أنت متأكد من حذف بيانات التواصل؟');
    if (!confirmed) return;

    setDeleting(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/${contact.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'فشل الحذف');
      }
      setContact(null);
      setForm(emptyForm());
      setIsEditing(false);
      setMessage('تم الحذف بنجاح ✅');
    } catch (e) {
      setMessage(`خطأ: ${e.message}`);
    } finally {
      setDeleting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return <p style={styles.loading}>جاري التحميل...</p>;
  }

  const view = contactToForm(contact);

  // Display view: contact exists and not currently editing
  if (contact && !isEditing) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.cardsGrid}>
          {view.addresses.filter(Boolean).map((a, i) => (
            <div style={styles.fieldCard} key={`addr-${i}`}>
              <span style={styles.displayLabel}>📍 العنوان {view.addresses.length > 1 ? i + 1 : ''}</span>
              <span style={styles.displayValue}>{a}</span>
            </div>
          ))}
          {view.phones.filter(Boolean).map((p, i) => (
            <div style={styles.fieldCard} key={`phone-${i}`}>
              <span style={styles.displayLabel}>📞 هاتف {i + 1}</span>
              <span style={styles.displayValue}>{p}</span>
            </div>
          ))}
          {view.emails.filter(Boolean).map((em, i) => (
            <div style={styles.fieldCard} key={`email-${i}`}>
              <span style={styles.displayLabel}>📧 بريد إلكتروني {i + 1}</span>
              <span style={styles.displayValue}>{em}</span>
            </div>
          ))}
        </div>

        <div style={styles.actionsRow}>
          <button type="button" onClick={startEdit} style={styles.editButton}>
            ✏️ تعديل
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={styles.deleteButton}
          >
            {deleting ? 'جاري الحذف...' : '🗑️ حذف'}
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    );
  }

  // Form view: no contact yet, or editing an existing one
  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <FieldGroup
          title="العناوين"
          icon="📍"
          field="addresses"
          items={form.addresses}
          onChange={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
          placeholder="مثال: 1 مصطفى رفعت, شيراتون"
          type="text"
        />

        <FieldGroup
          title="أرقام الهاتف"
          icon="📞"
          field="phones"
          items={form.phones}
          onChange={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
          placeholder="01000000000"
          type="tel"
        />

        <FieldGroup
          title="البريد الإلكتروني"
          icon="📧"
          field="emails"
          items={form.emails}
          onChange={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
          placeholder="example@domain.com"
          type="email"
        />

        <div style={styles.formActions}>
          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? 'جاري الحفظ...' : 'حفظ بيانات التواصل'}
          </button>
          {contact && (
            <button type="button" onClick={cancelEdit} style={styles.cancelButton}>
              إلغاء
            </button>
          )}
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

function FieldGroup({ title, icon, field, items, onChange, onAdd, onRemove, placeholder, type }) {
  return (
    <div style={styles.group}>
      <label style={styles.groupLabel}>{icon} {title}</label>
      {items.map((value, index) => (
        <div style={styles.itemRow} key={`${field}-${index}`}>
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(field, index, e.target.value)}
            style={styles.input}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(field, index)}
              style={styles.removeItemButton}
              title="حذف"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onAdd(field)} style={styles.addItemButton}>
        + إضافة {title === 'العناوين' ? 'عنوان' : title === 'أرقام الهاتف' ? 'رقم هاتف' : 'بريد إلكتروني'}
      </button>
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: 700, direction: 'rtl' },
  loading: { color: '#94a3b8', fontSize: 15 },
  form: { display: 'flex', flexDirection: 'column', gap: 4, background: '#1e293b', padding: 24, borderRadius: 16 },

  group: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 },
  groupLabel: { color: '#94a3b8', fontSize: 14, fontWeight: 600 },
  itemRow: { display: 'flex', gap: 8, alignItems: 'center' },

  input: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
  },
  removeItemButton: {
    width: 38,
    height: 38,
    flexShrink: 0,
    background: 'transparent',
    color: '#f87171',
    border: '1px solid #f87171',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 16,
  },
  addItemButton: {
    alignSelf: 'flex-start',
    padding: '8px 14px',
    background: 'transparent',
    color: '#ffc107',
    border: '1px dashed #ffc107',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },

  formActions: { display: 'flex', gap: 12, marginTop: 8 },
  button: {
    flex: 1,
    padding: '14px 20px',
    background: '#ffc107',
    color: '#000',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 15,
  },
  cancelButton: {
    padding: '14px 20px',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: 'bold',
    border: '1px solid #334155',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 15,
  },
  message: { marginTop: 12, color: '#ffc107', fontSize: 14 },

  // Display view styles
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  fieldCard: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 14,
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  displayLabel: { color: '#94a3b8', fontSize: 13 },
  displayValue: { color: '#fff', fontSize: 16, fontWeight: 600, wordBreak: 'break-word' },
  actionsRow: { display: 'flex', gap: 12, marginTop: 24 },
  editButton: {
    flex: 1,
    padding: '14px 20px',
    background: '#ffc107',
    color: '#000',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 15,
  },
  deleteButton: {
    flex: 1,
    padding: '14px 20px',
    background: 'transparent',
    color: '#f87171',
    fontWeight: 'bold',
    border: '1px solid #f87171',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 15,
  },
};