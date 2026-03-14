'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedShapes from '@/components/AnimatedShapes';

const allProjects = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    title: 'وزارة الداخلية',
    desc: 'نظام كاميرات المراقبة – قسم شرطة أم دومة بسوهاج. نظام إنذار الحريق – قسم شرطة سنباط بالغربية. نظام إنذار الحريق – قسم شرطة حانوت بالغربية. نظام إنذار الحريق – قسم شرطة الوايلي. تنفيذ البنية التحتية للبيانات – دار الضيافة',
    category: 'حكومي'
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    title: 'مستشفى النيل بدراوي المعادي',
    desc: 'تنفيذ جميع انظمة التيار الخفيف من البنية التحتية لكبلات النحاس و الفايبر تنفيذ اعمال انظمة كاميرات المراقبة و انذار الحريق و الصوتيات و الدش المركزي',
    category: 'صحي'
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    title: 'مصنع أندريا وجورج للذهب',
    desc: 'تنفيذ جميع أنظمة التيار الخفيف من مرحلة الأعمال التأسيسية حتى مرحلة التشغيل، وتشمل: أنظمة المراقبة بالكاميرات، التحكم في الدخول، إنذار الحريق، الإذاعة الداخلية، البنية التحتية للنحاس والألياف الضوئية، ونظام السنترال.',
    category: 'صناعي'
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    title: 'مجمع تجاري - سيتي سنتر',
    desc: 'تنفيذ أنظمة التيار الخفيف الشاملة للمباني التجارية تشمل كاميرات المراقبة، أنظمة الصوت، والبنية التحتية للشبكات',
    category: 'تجاري'
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    title: 'مقر شركة الاتصالات',
    desc: 'تركيب أنظمة الأمن والمراقبة المتطورة مع نظام التحكم في الدخول والبنية التحتية للألياف الضوئية',
    category: 'إداري'
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
    title: 'مصنع الأدوية الحديث',
    desc: 'حلول متكاملة للأنظمة الذكية في المصانع تشمل أنظمة المراقبة وإنذار الحريق والتحكم الآلي',
    category: 'صناعي'
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    title: 'فندق النيل الدولي',
    desc: 'تنفيذ أنظمة التيار الخفيف الفندقية الشاملة من كاميرات مراقبة، نظام الدش المركزي، والصوتيات',
    category: 'فندقي'
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
    title: 'جامعة المستقبل',
    desc: 'تركيب أنظمة الأمن والمراقبة للحرم الجامعي مع نظام الإذاعة الداخلية والبنية التحتية للشبكات',
    category: 'تعليمي'
  },
  {
    id: 9,
    img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
    title: 'مركز التسوق الكبير',
    desc: 'أنظمة مراقبة متطورة مع نظام إنذار الحريق والصوتيات لمركز تسوق بمساحة 50,000 متر مربع',
    category: 'تجاري'
  },
  {
    id: 10,
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    title: 'مصنع الإلكترونيات',
    desc: 'تنفيذ شامل لأنظمة التحكم والمراقبة الصناعية مع أنظمة الأمن المتقدمة',
    category: 'صناعي'
  },
  {
    id: 11,
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    title: 'مركز البيانات الوطني',
    desc: 'بنية تحتية متكاملة للألياف الضوئية مع أنظمة أمن وحماية متعددة المستويات',
    category: 'تقني'
  },
  {
    id: 12,
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    title: 'برج الأعمال الذكي',
    desc: 'تنفيذ أنظمة المباني الذكية الشاملة من مراقبة، تحكم، وأتمتة كاملة',
    category: 'إداري'
  }
];

export default function ProjectsPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionStyle = {
    padding: isMobile ? '100px 5% 50px' : '120px 8% 80px',
    minHeight: '100vh'
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: isMobile ? '32px' : '48px',
    marginBottom: isMobile ? '20px' : '30px',
    color: '#333'
  };

  const subheadingStyle = {
    textAlign: 'center',
    fontSize: isMobile ? '16px' : '18px',
    color: '#666',
    marginBottom: isMobile ? '40px' : '60px'
  };

  const containerStyle = {
    background: 'white',
    padding: isMobile ? '30px 20px' : '70px',
    borderRadius: isMobile ? '25px' : '40px',
    boxShadow: '0 50px 120px rgba(0, 0, 0, 0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: isMobile ? '25px' : '40px'
  };

  const getCardStyle = (index) => ({
    background: '#f9f9f9',
    borderRadius: isMobile ? '20px' : '25px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hoveredCard === index && !isMobile ? 'translateY(-15px)' : 'translateY(0)',
    boxShadow: hoveredCard === index ? '0 25px 70px rgba(0, 0, 0, 0.15)' : '0 20px 60px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer'
  });

  const imageStyle = {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  };

  const contentStyle = {
    padding: '24px'
  };

  const titleStyle = {
    marginBottom: '12px',
    fontSize: '20px',
    color: '#333'
  };

  const descStyle = {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6'
  };

  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <section style={sectionStyle}>
        <h1 style={headingStyle}>جميع مشاريعنا</h1>
        <p style={subheadingStyle}>استعرض مجموعة من أعمالنا المتميزة في مجال التيار الخفيف</p>
        
        <div style={containerStyle}>
          <div style={gridStyle}>
            {allProjects.map((project, i) => (
              <Link 
                key={i}
                href={`/projects/${project.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div 
                  style={getCardStyle(i)}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <Image 
                      src={project.img} 
                      alt={project.title} 
                      width={400} 
                      height={220}
                      style={{
                        ...imageStyle,
                        transform: hoveredCard === i ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                  </div>
                  <div style={contentStyle}>
                    <h3 style={titleStyle}>{project.title}</h3>
                    <p style={descStyle}>{project.desc}</p>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '12px',
                      padding: '6px 16px',
                      background: '#ffc107',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {project.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link 
            href="/"
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
            العودة للرئيسية
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
