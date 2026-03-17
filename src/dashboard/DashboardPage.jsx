import { useState } from 'react';
import DashboardLogin from './DashboardLogin';
import Dashboard from './Dashboard';

export default function DashboardPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('dashboard_token') || '');

  const handleLogin = (t) => setToken(t);

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_token');
    setToken('');
  };

  if (!token) return <DashboardLogin onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} token={token} />;
}
