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

// نرتب المشاريع حسب حقل order/position لو موجود، وإلا نسيبها زي ما هي
function sortByOrder(list) {
  if (!Array.isArray(list)) return list;
  return [...list].sort((a, b) => {
    const oa = a.order ?? a.position ?? 0;
    const ob = b.order ?? b.position ?? 0;
    return oa - ob;
  });
}

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
      .then(data => setProjects(Array.isArray(data) && data.length ? sortByOrder(data) : allProjects))
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
          systems: p.systems || [],
          // مشروع جديد بيتحط في الآخر
          order: projects.length,
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
          systems: p.systems || [],
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      if (!updated || !updated.id) throw new Error('Invalid response');
      const listRes = await fetch(`${API}/projects`);
      const list = await listRes.json();
      if (Array.isArray(list)) {
        setProjects(sortByOrder(list));
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

  // تحديث ترتيب المشاريع بعد السحب والإفلات
  const reorderProjects = async (newOrder) => {
    // تحديث فوري في الواجهة
    setProjects(newOrder);

    try {
      await Promise.all(
        newOrder.map((p, idx) =>
          fetch(`${API}/projects/${Number(p.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              title: p.title,
              description: p.description ?? p.desc,
              category: p.category,
              img: p.img,
              status: p.status,
              work_type: p.work_type,
              systems: p.systems || [],
              order: idx,
            }),
          })
        )
      );
      window.dispatchEvent(new Event('projects-updated'));
    } catch (e) {
      console.error('reorderProjects error:', e.message);
      // لو حصل خطأ، نرجع نجيب الترتيب الصح من السيرفر
      try {
        const res = await fetch(`${API}/projects`);
        const list = await res.json();
        if (Array.isArray(list)) setProjects(sortByOrder(list));
      } catch {}
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