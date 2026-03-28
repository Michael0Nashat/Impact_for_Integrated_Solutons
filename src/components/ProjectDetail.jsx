import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedShapes from './AnimatedShapes';
import { API } from '../dashboard/useDashboardData';
import { allProjects } from '../data/defaultProjects';

const cardBox = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(12px)',
  borderRadius: '20px',
  padding: '32px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  marginBottom: '24px',
};

// map category → systems list
const systemsByCategory = {
  'حكومي':  ['أنظمة كاميرات المراقبة', 'أنظمة إنذار الحريق', 'البنية التحتية للبيانات', 'التحكم في الدخول', 'أنظمة الإذاعة الداخلية'],
  'صحي':   ['كاميرات المراقبة', 'إنذار الحريق', 'الصوتيات', 'الدش المركزي', 'البنية التحتية للفايبر والنحاس'],
  'صناعي': ['أنظمة المراقبة', 'التحكم في الدخول', 'إنذار الحريق', 'الإذاعة الداخلية', 'البنية التحتية للألياف الضوئية', 'السنترال'],
  'تجاري': ['كاميرات المراقبة', 'أنظمة الصوت', 'إنذار الحريق', 'البنية التحتية للشبكات'],
  'إداري':  ['أنظمة الأمن والمراقبة', 'التحكم في الدخول', 'الألياف الضوئية', 'أنظمة الصوت'],
  'فندقي': ['كاميرات المراقبة', 'الدش المركزي', 'الصوتيات', 'إنذار الحريق', 'التحكم في الدخول'],
  'تعليمي':['أنظمة الأمن والمراقبة', 'الإذاعة الداخلية', 'البنية التحتية للشبكات', 'إنذار الحريق'],
  'تقني':  ['الألياف الضوئية', 'أنظمة الأمن متعددة المستويات', 'التحكم في الدخول', 'المراقبة المتقدمة'],
};

// Removed defaultSystemsList as per user request to use dynamic table data


const defaultHighlights = [
  { icon: '🏗️', label: 'تنفيذ احترافي' },
  { icon: '🔒', label: 'أمان عالي المستوى' },
  { icon: '🛠️', label: 'صيانة ودعم مستمر' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dynSystems, setDynSystems] = useState([]);
  const [dynHighlights, setDynHighlights] = useState([]);

  useEffect(() => {
    // Fetch project
    fetch(`${API}/projects`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) && data.length ? data : allProjects;
        setProject(list.find(p => String(p.id) === String(id)) ?? null);
      })
      .catch(() => {
        setProject(allProjects.find(p => String(p.id) === String(id)) ?? null);
      });

    // Fetch systems
    fetch(`${API}/default-systems`)
      .then(r => r.json())
      .then(data => setDynSystems(Array.isArray(data) ? data.map(s => s.name) : []))
      .catch(() => setDynSystems([]));

    // Fetch highlights
    fetch(`${API}/highlights`)
      .then(r => r.json())
      .then(data => setDynHighlights(Array.isArray(data) && data.length ? data.map(h => ({ icon: '✨', label: h.label })) : defaultHighlights))
      .catch(() => setDynHighlights(defaultHighlights))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <AnimatedShapes /><Navbar />
        <div style={{ textAlign: 'center', padding: '120px 20px', direction: 'rtl', fontSize: '18px', color: '#888' }}>
          جاري التحميل...
        </div>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <AnimatedShapes /><Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px', direction: 'rtl' }}>
          <h2>المشروع غير موجود</h2>
          <Link to="/#projects" style={{ color: '#6366f1' }}>العودة للمشاريع</Link>
        </div>
        <Footer />
      </>
    );
  }

  const desc = project.description ?? project.desc ?? '';
  const systems = systemsByCategory[project.category] ?? dynSystems;

  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <div style={{ direction: 'rtl', padding: '80px 8% 60px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* back */}
        <Link to="/#projects" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '15px', display: 'inline-block', marginBottom: '28px' }}>
          ← العودة للمشاريع
        </Link>

        {/* hero image */}
        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', marginBottom: '32px', position: 'relative' }}>
          <img src={project.img} alt={project.title} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
            padding: '40px 32px 28px',
          }}>
            {project.category && (
              <span style={{ background: '#ffc107', color: '#000', padding: '5px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' }}>
                {project.category}
              </span>
            )}
            <h1 style={{ color: '#fff', fontSize: '34px', margin: '8px 0 0' }}>{project.title}</h1>
          </div>
        </div>

        {/* highlights row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {dynHighlights.map((h, i) => (
            <div key={i} style={{ ...cardBox, marginBottom: 0, textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{h.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{h.label}</div>
            </div>
          ))}
        </div>

        {/* about */}
        <div style={cardBox}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#222' }}>عن المشروع</h2>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '2', margin: 0 }}>{desc}</p>
        </div>

        {/* systems */}
        <div style={cardBox}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#222' }}>الأنظمة المنفذة</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {systems.map((sys, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#f5f5f5', borderRadius: '12px', fontSize: '14px', color: '#333' }}>
                <span style={{ color: '#6366f1', fontSize: '16px', flexShrink: 0 }}>✓</span>
                {sys}
              </li>
            ))}
          </ul>
        </div>

        {/* info + cta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={cardBox}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#222' }}>معلومات المشروع</h2>
            {[
              { label: 'رقم المشروع', value: `#${project.id}` },
              { label: 'التصنيف', value: project.category ?? '—' },
              { label: 'حالة المشروع', value: project.status ?? 'مكتمل ✅' },
              { label: 'نوع العمل', value: project.work_type ?? 'تيار خفيف وأنظمة ذكية' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #eee' : 'none', fontSize: '14px' }}>
                <span style={{ color: '#888' }}>{row.label}</span>
                <span style={{ fontWeight: 'bold', color: '#333' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ ...cardBox, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '10px' }}>هل تريد مشروعاً مشابهاً؟</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginBottom: '20px' }}>تواصل معنا الآن وسنقدم لك أفضل الحلول</p>
            <Link to="/#contact" style={{
              background: '#ffc107', color: '#000', padding: '12px 28px',
              borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px',
            }}>
              تواصل معنا
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
