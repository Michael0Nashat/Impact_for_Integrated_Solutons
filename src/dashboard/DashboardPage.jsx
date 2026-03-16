import { useState } from 'react';
import DashboardLogin from './DashboardLogin';
import Dashboard from './Dashboard';

export default function DashboardPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('dashboard_auth') === '1');

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth');
    setAuthed(false);
  };

  if (!authed) return <DashboardLogin onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}
