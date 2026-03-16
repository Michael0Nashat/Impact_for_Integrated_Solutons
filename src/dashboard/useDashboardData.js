import { useState } from 'react';
import { allProjects } from '../data/defaultProjects';

const DEFAULT_HERO = {
  title: 'نطور حلول برمجية مبتكرة',
  subtitle: 'نقدم خدمات رقمية متكاملة لتطوير الشركات والمؤسسات بأعلى جودة واحترافية.',
  btnText: 'ابدأ مشروعك الآن',
  btnLink: '#contact',
  image: '/IMG_20260316_143125.png'
};

const DEFAULT_ABOUT = {
  title: 'من نحن',
  text: 'تأسست شركة امباكت سنة 2023 بخبرة كبيرة في مجال التيار الخفيف و تأسيس المواقع و التطبيقات و معرفة قوية بالسوق أكتر من 13 سنة، وكمان معانا شهادات من براندات عالمية. هدفنا إننا نساعد العملاء في كل مراحل المشروع من أول التصميم لحد التنفيذ.',
  image: '/IMG-20260314-WA0029.jpg'
};


function load(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function useDashboardData() {
  const [hero, setHeroState] = useState(() => load('dash_hero', DEFAULT_HERO));
  const [about, setAboutState] = useState(() => load('dash_about', DEFAULT_ABOUT));
  const [projects, setProjectsState] = useState(() => load('dash_projects', allProjects));

  const saveHero = (data) => { setHeroState(data); save('dash_hero', data); };
  const saveAbout = (data) => { setAboutState(data); save('dash_about', data); };

  const addProject = (p) => {
    const next = [...projects, { ...p, id: Date.now() }];
    setProjectsState(next); save('dash_projects', next);
  };
  const updateProject = (id, p) => {
    const next = projects.map(x => x.id === id ? { ...x, ...p } : x);
    setProjectsState(next); save('dash_projects', next);
  };
  const deleteProject = (id) => {
    const next = projects.filter(x => x.id !== id);
    setProjectsState(next); save('dash_projects', next);
  };

  return { hero, saveHero, about, saveAbout, projects, addProject, updateProject, deleteProject };
}
