import { useState, useEffect } from 'react';

const projectStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scrollRight {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .images-grid-container { width: 100%; margin-top: 40px; padding: 0 5%; box-sizing: border-box; }
  .images-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
  .project-image { width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 12px; transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  .project-image:hover { transform: scale(1.03); }
  .project-image img { object-fit: cover; width: 100%; height: 100%; }
  @media (min-width: 480px) {
    .images-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  }
  @media (min-width: 769px) {
    .images-grid-container { padding: 0; margin-top: 60px; }
    .images-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
    .project-image { border-radius: 15px; }
  }
`;

const projects = [
  {
    img: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    title: 'وزارة الداخلية',
    desc: 'نظام كاميرات المراقبة – قسم شرطة أم دومة بسوهاج. نظام إنذار الحريق – قسم شرطة سنباط بالغربية. نظام إنذار الحريق – قسم شرطة حانوت بالغربية. نظام إنذار الحريق – قسم شرطة الوايلي. تنفيذ البنية التحتية للبيانات – دار الضيافة',
    category: 'حكومي'
  },
  {
    img: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    title: 'مستشفى النيل بدراوي المعادي',
    desc: 'تنفيذ جميع انظمة التيار الخفيف من البنية التحتية لكبلات النحاس و الفايبر تنفيذ اعمال انظمة كاميرات المراقبة و انذار الحريق و الصوتيات و الدش المركزي',
    category: 'صحي'
  },
  {
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    title: 'مصنع أندريا وجورج للذهب',
    desc: 'تنفيذ جميع أنظمة التيار الخفيف من مرحلة الأعمال التأسيسية حتى مرحلة التشغيل، وتشمل: أنظمة المراقبة بالكاميرات، التحكم في الدخول، إنذار الحريق، الإذاعة الداخلية، البنية التحتية للنحاس والألياف الضوئية، ونظام السنترال.',
    category: 'صناعي'
  }
];

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

export default function Projects() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    const section = document.getElementById('projects');
    if (section) observer.observe(section);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const sectionStyle = {
    padding: isMobile ? '0' : '0 8%',
    marginTop: isMobile ? '50px' : '80px',
    overflowX: 'hidden'
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: isMobile ? '26px' : '40px',
    marginBottom: isMobile ? '30px' : '60px',
    padding: isMobile ? '0 5%' : '0',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'all 0.6s ease-out'
  };

  const containerStyle = {
    background: 'white',
    padding: isMobile ? '20px 15px' : '70px',
    borderRadius: isMobile ? '20px' : '40px',
    margin: isMobile ? '0 5%' : '0',
    boxShadow: '0 50px 120px rgba(0, 0, 0, 0.1)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s ease-out 0.2s'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: isMobile ? '25px' : '40px'
  };

  const getCardStyle = (index) => ({
    background: '#f9f9f9',
    borderRadius: isMobile ? '20px' : '25px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hoveredCard === index && !isMobile ? 'translateY(-15px)' : 'translateY(0)',
    boxShadow: hoveredCard === index ? '0 25px 70px rgba(0, 0, 0, 0.15)' : '0 20px 60px rgba(0, 0, 0, 0.08)',
    opacity: isVisible ? 1 : 0,
    animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.15}s both` : 'none'
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
    transition: 'color 0.3s ease'
  };

  const descStyle = {
    fontSize: '14px',
    color: '#555'
  };

  const buttonContainerStyle = {
    textAlign: 'center',
    marginTop: '32px',
    marginBottom: '30px',
    padding: isMobile ? '0 5%' : '0'
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: isMobile ? '14px 32px' : '16px 44px',
    background: isButtonHovered ? '#e0a800' : '#ffc107',
    color: 'black',
    borderRadius: '30px',
    fontWeight: 'bold',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    transform: isButtonHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
    fontSize: isMobile ? '14px' : '16px',
    boxShadow: isButtonHovered ? '0 10px 25px rgba(255, 193, 7, 0.4)' : '0 5px 15px rgba(255, 193, 7, 0.2)'
  };

  return (
    <>
      <style>{projectStyles}</style>
      <section id="projects" style={sectionStyle}>
        <h2 style={headingStyle}>مشاريعنا</h2>
        <div style={containerStyle}>
          <div style={gridStyle}>
            {(showAll ? allProjects : projects).map((project, i) => (
              <div 
                key={i}
                style={getCardStyle(i)}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ overflow: 'hidden' }}>
                  <img 
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
                  {project.category && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showAll && (
          <div style={buttonContainerStyle}>
            <button
              style={{ ...buttonStyle, border: 'none', cursor: 'pointer' }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={() => setShowAll(true)}
            >
              المزيد
            </button>
          </div>
        )}
      </section>
    </>
  );
}
