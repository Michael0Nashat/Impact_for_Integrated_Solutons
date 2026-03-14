import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedShapes from '../../components/AnimatedShapes';

const projectsData = {
  1: {
    img: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    title: 'وزارة الداخلية',
    category: 'حكومي',
    client: 'وزارة الداخلية - جمهورية مصر العربية',
    duration: '18 شهر',
    location: 'سوهاج، الغربية، القاهرة',
    description: 'مشروع شامل لتنفيذ أنظمة الأمن والمراقبة في عدة مواقع تابعة لوزارة الداخلية',
    details: [
      'نظام كاميرات المراقبة – قسم شرطة أم دومة بسوهاج',
      'نظام إنذار الحريق – قسم شرطة سنباط بالغربية',
      'نظام إنذار الحريق – قسم شرطة حانوت بالغربية',
      'نظام إنذار الحريق – قسم شرطة الوايلي',
      'تنفيذ البنية التحتية للبيانات – دار الضيافة'
    ],
    technologies: ['كاميرات IP', 'أنظمة إنذار الحريق', 'البنية التحتية للشبكات', 'أنظمة التحكم']
  },
  2: {
    img: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    title: 'مستشفى النيل بدراوي المعادي',
    category: 'صحي',
    client: 'مستشفى النيل بدراوي',
    duration: '12 شهر',
    location: 'المعادي، القاهرة',
    description: 'تنفيذ شامل لجميع أنظمة التيار الخفيف في مستشفى حديث',
    details: [
      'البنية التحتية لكبلات النحاس والألياف الضوئية',
      'أنظمة كاميرات المراقبة عالية الدقة',
      'نظام إنذار الحريق المتطور',
      'أنظمة الصوتيات والإذاعة الداخلية',
      'نظام الدش المركزي'
    ],
    technologies: ['ألياف ضوئية', 'كاميرات 4K', 'أنظمة صوتية', 'إنذار حريق ذكي']
  },
  3: {
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    title: 'مصنع أندريا وجورج للذهب',
    category: 'صناعي',
    client: 'شركة أندريا وجورج',
    duration: '15 شهر',
    location: 'المنطقة الصناعية، القاهرة',
    description: 'مشروع متكامل لأنظمة التيار الخفيف في مصنع ذهب حديث',
    details: [
      'أنظمة المراقبة بالكاميرات عالية الدقة',
      'نظام التحكم في الدخول متعدد المستويات',
      'نظام إنذار الحريق الذكي',
      'نظام الإذاعة الداخلية',
      'البنية التحتية للنحاس والألياف الضوئية',
      'نظام السنترال الرقمي'
    ],
    technologies: ['Access Control', 'CCTV', 'Fire Alarm', 'PABX', 'Structured Cabling']
  },
  4: {
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    title: 'مجمع تجاري - سيتي سنتر',
    category: 'تجاري',
    client: 'شركة التطوير العقاري',
    duration: '10 أشهر',
    location: 'القاهرة الجديدة',
    description: 'تنفيذ أنظمة التيار الخفيف الشاملة للمباني التجارية',
    details: [
      'كاميرات المراقبة عالية الدقة',
      'أنظمة الصوت والإذاعة الداخلية',
      'البنية التحتية للشبكات',
      'نظام التحكم في الدخول'
    ],
    technologies: ['IP Cameras', 'Audio Systems', 'Network Infrastructure', 'Access Control']
  },
  5: {
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    title: 'مقر شركة الاتصالات',
    category: 'إداري',
    client: 'شركة الاتصالات المصرية',
    duration: '8 أشهر',
    location: 'القاهرة',
    description: 'تركيب أنظمة الأمن والمراقبة المتطورة',
    details: [
      'نظام التحكم في الدخول متعدد المستويات',
      'البنية التحتية للألياف الضوئية',
      'أنظمة المراقبة الذكية',
      'نظام إنذار الحريق'
    ],
    technologies: ['Fiber Optics', 'Smart CCTV', 'Access Control', 'Fire Alarm']
  },
  6: {
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
    title: 'مصنع الأدوية الحديث',
    category: 'صناعي',
    client: 'شركة الأدوية المتقدمة',
    duration: '14 شهر',
    location: 'العاشر من رمضان',
    description: 'حلول متكاملة للأنظمة الذكية في المصانع',
    details: [
      'أنظمة المراقبة الصناعية',
      'إنذار الحريق المتطور',
      'التحكم الآلي والأتمتة',
      'البنية التحتية الشاملة'
    ],
    technologies: ['Industrial CCTV', 'Fire Detection', 'Automation', 'Structured Cabling']
  },
  7: {
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    title: 'فندق النيل الدولي',
    category: 'فندقي',
    client: 'مجموعة الفنادق الدولية',
    duration: '12 شهر',
    location: 'الأقصر',
    description: 'تنفيذ أنظمة التيار الخفيف الفندقية الشاملة',
    details: [
      'كاميرات مراقبة في جميع المناطق',
      'نظام الدش المركزي',
      'أنظمة الصوتيات والموسيقى',
      'نظام إدارة المباني الذكي'
    ],
    technologies: ['CCTV', 'SMATV', 'Audio Systems', 'BMS']
  },
  8: {
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
    title: 'جامعة المستقبل',
    category: 'تعليمي',
    client: 'جامعة المستقبل',
    duration: '16 شهر',
    location: 'القاهرة',
    description: 'تركيب أنظمة الأمن والمراقبة للحرم الجامعي',
    details: [
      'نظام الإذاعة الداخلية للحرم',
      'البنية التحتية للشبكات',
      'أنظمة المراقبة الشاملة',
      'نظام التحكم في الدخول'
    ],
    technologies: ['PA System', 'Network Infrastructure', 'CCTV', 'Access Control']
  },
  9: {
    img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
    title: 'مركز التسوق الكبير',
    category: 'تجاري',
    client: 'شركة المراكز التجارية',
    duration: '11 شهر',
    location: 'الإسكندرية',
    description: 'أنظمة مراقبة متطورة لمركز تسوق كبير',
    details: [
      'نظام إنذار الحريق المتقدم',
      'أنظمة الصوتيات والإعلانات',
      'كاميرات مراقبة 4K',
      'نظام إدارة مواقف السيارات'
    ],
    technologies: ['Fire Alarm', 'PA System', '4K CCTV', 'Parking Management']
  },
  10: {
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    title: 'مصنع الإلكترونيات',
    category: 'صناعي',
    client: 'شركة الإلكترونيات المتطورة',
    duration: '13 شهر',
    location: 'برج العرب',
    description: 'تنفيذ شامل لأنظمة التحكم والمراقبة الصناعية',
    details: [
      'أنظمة الأمن المتقدمة',
      'التحكم في الدخول الذكي',
      'المراقبة الصناعية',
      'البنية التحتية المتكاملة'
    ],
    technologies: ['Security Systems', 'Smart Access', 'Industrial Monitoring', 'Infrastructure']
  },
  11: {
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    title: 'مركز البيانات الوطني',
    category: 'تقني',
    client: 'الهيئة القومية للاتصالات',
    duration: '20 شهر',
    location: 'القاهرة',
    description: 'بنية تحتية متكاملة للألياف الضوئية',
    details: [
      'أنظمة أمن متعددة المستويات',
      'البنية التحتية للألياف الضوئية',
      'أنظمة المراقبة المتقدمة',
      'نظام إنذار الحريق الذكي'
    ],
    technologies: ['Multi-level Security', 'Fiber Infrastructure', 'Advanced CCTV', 'Smart Fire Alarm']
  },
  12: {
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    title: 'برج الأعمال الذكي',
    category: 'إداري',
    client: 'شركة التطوير العقاري الذكي',
    duration: '15 شهر',
    location: 'القاهرة الجديدة',
    description: 'تنفيذ أنظمة المباني الذكية الشاملة',
    details: [
      'نظام إدارة المباني الذكي',
      'التحكم والأتمتة الكاملة',
      'أنظمة المراقبة المتطورة',
      'البنية التحتية المتكاملة'
    ],
    technologies: ['BMS', 'Building Automation', 'Smart CCTV', 'Integrated Infrastructure']
  }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const project = projectsData[Number(id)];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!project) {
    return (
      <>
        <AnimatedShapes />
        <Navbar />
        <div style={{ padding: '150px 20px', textAlign: 'center' }}>
          <h1>المشروع غير موجود</h1>
          <Link to="/projects" style={{ color: '#ffc107', marginTop: '20px', display: 'inline-block' }}>
            العودة لصفحة المشاريع
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const sectionStyle = {
    padding: isMobile ? '100px 5% 50px' : '120px 8% 80px',
    minHeight: '100vh'
  };

  const containerStyle = {
    background: 'white',
    padding: isMobile ? '30px 20px' : '60px',
    borderRadius: isMobile ? '25px' : '40px',
    boxShadow: '0 50px 120px rgba(0, 0, 0, 0.1)'
  };

  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ width: '100%', height: isMobile ? '250px' : '400px', borderRadius: '20px', overflow: 'hidden', marginBottom: '30px' }}>
            <img
              src={project.img}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <span style={{ display: 'inline-block', padding: '8px 20px', background: '#ffc107', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>
            {project.category}
          </span>
          <h1 style={{ fontSize: isMobile ? '28px' : '42px', marginBottom: '20px', color: '#333' }}>{project.title}</h1>
          <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8' }}>{project.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', margin: '30px 0', padding: '30px', background: '#f9f9f9', borderRadius: '15px' }}>
            {[['العميل', project.client], ['المدة', project.duration], ['الموقع', project.location]].map(([label, value]) => (
              <div key={label} style={{ textAlign: isMobile ? 'right' : 'center' }}>
                <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>{label}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{value}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '24px', marginTop: '40px', marginBottom: '20px', color: '#333', borderRight: '4px solid #ffc107', paddingRight: '15px' }}>تفاصيل المشروع</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {project.details.map((detail, i) => (
              <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid #eee', paddingRight: '20px' }}>
                <span style={{ marginLeft: '10px', color: '#ffc107' }}>✓</span>
                {detail}
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: '24px', marginTop: '40px', marginBottom: '20px', color: '#333', borderRight: '4px solid #ffc107', paddingRight: '15px' }}>التقنيات المستخدمة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '15px', marginTop: '20px' }}>
            {project.technologies.map((tech, i) => (
              <div key={i} style={{ padding: '12px', background: '#f0f0f0', borderRadius: '10px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>
                {tech}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/projects"
              style={{ display: 'inline-block', padding: isMobile ? '14px 32px' : '16px 44px', background: '#ffc107', color: 'black', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', fontSize: isMobile ? '14px' : '16px' }}
            >
              العودة للمشاريع
            </Link>
            <Link
              to="/#contact"
              style={{ display: 'inline-block', padding: isMobile ? '14px 32px' : '16px 44px', background: '#333', color: 'white', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', fontSize: isMobile ? '14px' : '16px' }}
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
