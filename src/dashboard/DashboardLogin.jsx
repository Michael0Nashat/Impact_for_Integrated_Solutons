import { useState } from 'react';
import { API } from './useDashboardData';

export default function DashboardLogin({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'خطأ في تسجيل الدخول'); return; }
      sessionStorage.setItem('dashboard_token', data.token);
      onLogin(data.token);
    } catch {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>لوحة التحكم</h2>
        <p style={styles.sub}>Impact Integrated Solutions</p>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input} placeholder="اسم المستخدم"
          value={user} onChange={e => setUser(e.target.value)}
          autoComplete="username"
        />
        <input
          style={styles.input} type="password" placeholder="كلمة المرور"
          value={pass} onChange={e => setPass(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? '...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', direction: 'rtl' },
  card: { background: '#1e293b', padding: '48px 40px', borderRadius: '20px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  title: { color: '#ffc107', textAlign: 'center', fontSize: '28px', marginBottom: '4px' },
  sub: { color: '#94a3b8', textAlign: 'center', fontSize: '14px', marginBottom: '8px' },
  error: { color: '#f87171', textAlign: 'center', fontSize: '14px' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '15px', outline: 'none', textAlign: 'right' },
  btn: { padding: '13px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' },
};
