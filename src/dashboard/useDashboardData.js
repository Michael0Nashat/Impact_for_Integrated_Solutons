import { useState, useEffect } from 'react';
import { allProjects } from '../data/defaultProjects';

export const API = import.meta.env.VITE_API_URL || 'https://impact-for-integrated-solutons-serv.vercel.app/api';

export const DEFAULT_HERO = {
  title: 'نطور حلول برمجية مبتكرة',
  subtitle: 'نقدم خدمات رقمية متكاملة لتطوير الشركات والمؤسسات بأعلى جودة واحترافية.',
  btnText: 'ابدأ مشروعك الآن',
  btnLink: '#contact',
  image: '/IMG_20260316_143125.png',
};

export const DEFAULT_ABOUT = {
  title: 'من نحن',
  text: 'تأسست شركة امباكت سنة 2023 بخبرة كبيرة في مجال التيار الخفيف و تأسيس المواقع و التطبيقات و معرفة قوية بالسوق أكتر من 13 سنة، وكمان معانا شهادات من براندات عالمية. هدفنا إننا نساعد العملاء في كل مراحل المشروع من أول التصميم لحد التنفيذ.',
  image: '/IMG-20260314-WA0029.jpg',
};

async function getSetting(key, fallback) {
  try {
    const res = await fetch(`${API}/settings/${key}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data ?? fallback;
  } catch { return fallback; }
}

async function putSetting(key, value, token) {
  await fetch(`${API}/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(value),
  });
}

export function useDashboardData(token = '') {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [projects, setProjects] = useState([]);
  const [brands, setBrands] = useState([]);
  const [hiddenBrandLogos, setHiddenBrandLogos] = useState([]);

  useEffect(() => {
    getSetting('hero', DEFAULT_HERO).then(setHero);
    getSetting('about', DEFAULT_ABOUT).then(setAbout);
    getSetting('hiddenBrandLogos', []).then(data => setHiddenBrandLogos(Array.isArray(data) ? data : []));
    fetch(`${API}/brands`)
      .then(r => r.json())
      .then(data => setBrands(Array.isArray(data) ? data : []))
      .catch(() => setBrands([]));
    fetch(`${API}/projects`)
      .then(r => r.json())
      .then(data => setProjects(Array.isArray(data) && data.length ? data : allProjects))
      .catch(() => setProjects(allProjects));
  }, []);

  const saveHero = async (data) => {
    setHero(data);
    await putSetting('hero', data, token);
  };

  const saveAbout = async (data) => {
    setAbout(data);
    await putSetting('about', data, token);
  };

  const addProject = async (p) => {
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: p.title, description: p.desc ?? p.description ?? '', category: p.category, img: p.img }),
      });
      if (!res.ok) throw new Error('Add failed');
      const created = await res.json();
      if (!created || !created.id) throw new Error('Invalid response');
      setProjects(prev => [created, ...prev]);
      window.dispatchEvent(new Event('projects-updated'));
    } catch (e) {
      console.error('addProject error:', e.message);
    }
  };

  const updateProject = async (id, p) => {
    try {
      const res = await fetch(`${API}/projects/${Number(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: p.title, description: p.desc ?? p.description ?? '', category: p.category, img: p.img }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      if (!updated || !updated.id) throw new Error('Invalid response');
      // re-fetch full list to stay in sync
      const listRes = await fetch(`${API}/projects`);
      const list = await listRes.json();
      if (Array.isArray(list)) {
        setProjects(list);
      } else {
        setProjects(prev => prev.map(x => Number(x.id) === Number(id) ? updated : x));
      }
      window.dispatchEvent(new Event('projects-updated'));
    } catch (e) {
      console.error('updateProject error:', e.message);
    }
  };

  const deleteProject = async (id) => {
    await fetch(`${API}/projects/${Number(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(prev => prev.filter(x => Number(x.id) !== Number(id)));
    window.dispatchEvent(new Event('projects-updated'));
  };

  const addBrand = async (dataUrl) => {
    try {
      const res = await fetch(`${API}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ images: dataUrl }),
      });
      if (!res.ok) throw new Error('Add brand failed');
      const created = await res.json();
      setBrands(prev => [created, ...prev]);
    } catch (e) { console.error('addBrand error:', e.message); }
  };

  const deleteBrand = async (id) => {
    await fetch(`${API}/brands/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  const hideBrandLogo = async (logo) => {
    const updated = hiddenBrandLogos.includes(logo) ? hiddenBrandLogos : [...hiddenBrandLogos, logo];
    setHiddenBrandLogos(updated);
    try {
      await putSetting('hiddenBrandLogos', updated, token);
    } catch (e) { console.error('hideBrandLogo error:', e.message); }
  };

  const restoreBrandLogo = async (logo) => {
    const updated = hiddenBrandLogos.filter(l => l !== logo);
    setHiddenBrandLogos(updated);
    await putSetting('hiddenBrandLogos', updated, token);
  };

  return { hero, saveHero, about, saveAbout, projects, addProject, updateProject, deleteProject, brands, addBrand, deleteBrand, hiddenBrandLogos, hideBrandLogo, restoreBrandLogo };
}
