import { useState } from 'react';
import { useDashboardData } from './useDashboardData';
import HeroEditor from './HeroEditor';
import AboutEditor from './AboutEditor';
import ProjectsEditor from './ProjectsEditor';
import BrandsEditor from './BrandsEditor';

const tabs = [
  { id: 'hero', label: '🏠 Hero' },
  { id: 'about', label: '👥 من نحن' },
  { id: 'projects', label: '🗂️ المشاريع' },
  { id: 'brands', label: '🏷️ علامات تجارية' },
];

export default function Dashboard({ onLogout, token }) {
  const [activeTab, setActiveTab] = useState('hero');
  const { hero, saveHero, about, saveAbout, projects, addProject, updateProject, deleteProject, brands, addBrand, deleteBrand, hiddenBrandLogos, hideBrandLogo, restoreBrandLogo } = useDashboardData(token);

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <img src="/IMG-20260310-WA0017-removebg-preview.png" alt="logo" style={{ width: 60, height: 60, objectFit: 'contain' }} />
          <p style={styles.logoText}>لوحة التحكم</p>
        </div>
        <nav style={styles.nav}>
          {tabs.map(t => (
            <button
              key={t.id}
              style={{ ...styles.navBtn, ...(activeTab === t.id ? styles.navBtnActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarBottom}>
          <a href="/" target="_blank" style={styles.viewSiteBtn}>🌐 عرض الموقع</a>
          <button onClick={onLogout} style={styles.logoutBtn}>تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
        </div>
        <div style={styles.content}>
          {activeTab === 'hero' && <HeroEditor hero={hero} onSave={saveHero} token={token} />}
          {activeTab === 'about' && <AboutEditor about={about} onSave={saveAbout} token={token} />}
          {activeTab === 'projects' && (
            <ProjectsEditor
              projects={projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
              token={token}
            />
          )}
          {activeTab === 'brands' && (
            <BrandsEditor
              brands={brands}
              onAdd={addBrand}
              onDelete={deleteBrand}
              hiddenBrandLogos={hiddenBrandLogos}
              onHideBrandLogo={hideBrandLogo}
              onRestoreBrandLogo={restoreBrandLogo}
              token={token}
            />
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0f172a', direction: 'rtl', fontFamily: 'inherit' },
  sidebar: { width: 240, background: '#1e293b', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderLeft: '1px solid #334155', flexShrink: 0 },
  logo: { textAlign: 'center', marginBottom: 32 },
  logoText: { color: '#ffc107', fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  nav: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  navBtn: { padding: '12px 16px', background: 'transparent', color: '#94a3b8', border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'right', fontSize: 15, transition: 'all 0.2s' },
  navBtnActive: { background: '#ffc107', color: '#000', fontWeight: 'bold' },
  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: 8 },
  viewSiteBtn: { padding: '10px 16px', background: '#334155', color: '#fff', borderRadius: 10, textDecoration: 'none', textAlign: 'center', fontSize: 14 },
  logoutBtn: { padding: '10px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' },
  topBar: { padding: '20px 32px', borderBottom: '1px solid #334155', background: '#1e293b' },
  pageTitle: { color: '#fff', fontSize: 22 },
  content: { padding: '32px', flex: 1 },
};
