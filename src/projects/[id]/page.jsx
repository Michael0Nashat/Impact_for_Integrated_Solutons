'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedShapes from '@/components/AnimatedShapes';

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
  }
};

// Add default data for other projects
projectsData[4] = {
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
};

projectsData[5] = {
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
};

projectsData[6] = {
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
};

projectsData[7] = {
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
};

projectsData[8] = {
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
};

projectsData[9] = {
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
};

projectsData[10] = {
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
};

projectsData[11] = {
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
};

projectsData[12] = {
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
};

export default function ProjectDetail() {
  const params = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const project = projectsData[params.id];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
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
          <Link href="/projects" style={{ color: '#ffc107', marginTop: '20px', display: 'inline-block' }}>
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

  const imageContainerStyle = {
    width: '100%',
    height: isMobile ? '250px' : '400px',
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '30px'
  };

  const categoryBadgeStyle = {
    display: 'inline-block',
    padding: '8px 20px',
    background: '#ffc107',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: isMobile ? '28px' : '42px',
    marginBottom: '20px',
    color: '#333'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '20px',
    margin: '30px 0',
    padding: '30px',
    background: '#f9f9f9',
    borderRadius: '15px'
  };

  const infoItemStyle = {
    textAlign: isMobile ? 'right' : 'center'
  };

  const sectionTitleStyle = {
    fontSize: '24px',
    marginTop: '40px',
    marginBottom: '20px',
    color: '#333',
    borderRight: '4px solid #ffc107',
    paddingRight: '15px'
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0
  };

  const listItemStyle = {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    paddingRight: '20px',
    position: 'relative'
  };

  const techGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: '15px',
    marginTop: '20px'
  };

  const techBadgeStyle = {
    padding: '12px',
    background: '#f0f0f0',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <div style={imageContainerStyle}>
            <Image 
              src={project.img} 
              alt={project.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          <span style={categoryBadgeStyle}>{project.category}</span>
          <h1 style={titleStyle}>{project.title}</h1>
          <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8' }}>
            {project.description}
          </p>

          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>العميل</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{project.client}</div>
            </div>
            <div style={infoItemStyle}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>المدة</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{project.duration}</div>
            </div>
            <div style={infoItemStyle}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>الموقع</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{project.location}</div>
            </div>
          </div>

          <h2 style={sectionTitleStyle}>تفاصيل المشروع</h2>
          <ul style={listStyle}>
            {project.details.map((detail, i) => (
              <li key={i} style={listItemStyle}>
                <span style={{ marginLeft: '10px', color: '#ffc107' }}>✓</span>
                {detail}
              </li>
            ))}
          </ul>

          <h2 style={sectionTitleStyle}>التقنيات المستخدمة</h2>
          <div style={techGridStyle}>
            {project.technologies.map((tech, i) => (
              <div key={i} style={techBadgeStyle}>
                {tech}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/projects"
              style={{
                display: 'inline-block',
                padding: isMobile ? '14px 32px' : '16px 44px',
                background: '#ffc107',
                color: 'black',
                borderRadius: '30px',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '14px' : '16px'
              }}
            >
              العودة للمشاريع
            </Link>
            <Link 
              href="/#contact"
              style={{
                display: 'inline-block',
                padding: isMobile ? '14px 32px' : '16px 44px',
                background: '#333',
                color: 'white',
                borderRadius: '30px',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '14px' : '16px'
              }}
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
