import { useState, useEffect } from 'react';
import { allProjects } from '../data/defaultProjects';

export const API = 'https://impact-for-integrated-solutons-serv.vercel.app/api';

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
  const [defaultSystems, setDefaultSystems] = useState([]);

  useEffect(() => {
    getSetting('hero', DEFAULT_HERO).then(setHero);
    getSetting('about', DEFAULT_ABOUT).then(setAbout);

    fetch(`${API}/projects`)
      .then(r => r.json())
      .then(data => setProjects(Array.isArray(data) && data.length ? data : allProjects))
      .catch(() => setProjects(allProjects));

    fetch(`${API}/default-systems`)
      .then(r => r.json())
      .then(data => setDefaultSystems(Array.isArray(data) ? data : []))
      .catch(() => setDefaultSystems([]));


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
        body: JSON.stringify({
          title: p.title,
          description: p.desc,
          category: p.category,
          img: p.img,
          status: p.status,
          work_type: p.work_type,
          systems: p.systems || []
        }),
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
        body: JSON.stringify({
          title: p.title,
          description: p.desc,
          category: p.category,
          img: p.img,
          status: p.status,
          work_type: p.work_type,
          systems: p.systems || []
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      if (!updated || !updated.id) throw new Error('Invalid response');
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

  // Reorder projects (drag & drop). orderedIds = array of project ids in the new display order.
  // IMPORTANT: this now throws on failure (instead of swallowing the error) so the UI
  // (ProjectsEditor) can show a visible message and snap the drag back to the last good order.
  const reorderProjects = async (orderedIds) => {
    // Optimistic UI update: reorder local state immediately so the drag feels instant.
    const previous = projects;
    setProjects(prev => {
      const byId = new Map(prev.map(p => [Number(p.id), p]));
      const next = orderedIds.map(id => byId.get(Number(id))).filter(Boolean);
      // Safety net: if anything didn't map (e.g. stale id), keep the original list.
      return next.length === prev.length ? next : prev;
    });

    try {
      const res = await fetch(`${API}/projects/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order: orderedIds.map(Number) }),
      });

      if (res.status === 401) {
        setProjects(previous);
        throw new Error('Unauthorized');
      }
      if (!res.ok) {
        setProjects(previous);
        throw new Error(`Reorder failed (${res.status})`);
      }

      const updated = await res.json();
      if (Array.isArray(updated)) {
        setProjects(updated);
      }
      window.dispatchEvent(new Event('projects-updated'));
    } catch (e) {
      console.error('reorderProjects error:', e.message);
      // Re-fetch the real order from the server so the UI doesn't stay out of sync,
      // then re-throw so the caller (drag UI) can surface a visible error.
      try {
        const listRes = await fetch(`${API}/projects`);
        const list = await listRes.json();
        if (Array.isArray(list)) setProjects(list);
      } catch {}
      throw e;
    }
  };

  // Default Systems CRUD
  const addDefaultSystem = async (name) => {
    const res = await fetch(`${API}/default-systems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    });
    const created = await res.json();
    setDefaultSystems(prev => [...prev, created]);
  };

  const deleteDefaultSystem = async (id) => {
    await fetch(`${API}/default-systems/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setDefaultSystems(prev => prev.filter(x => x.id !== id));
  };



  return {
    hero, saveHero, about, saveAbout,
    projects, addProject, updateProject, deleteProject, reorderProjects,
    defaultSystems, addDefaultSystem, deleteDefaultSystem,
  };
}