import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
    desc: 'نظام كاميرات المراقبة – قسم شرطة أم دومة بسوهاج. نظام إنذار الحريق – قسم شرطة سنباط بالغربية. نظام إنذار الحريق – قسم شرطة حانوت بالغربية. نظام إنذار الحريق – قسم شرطة الوايلي. تنفيذ البنية التحتية للبيانات – دار الضيافة'
  },
  {
    img: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    title: 'مستشفى النيل بدراوي المعادي',
    desc: 'تنفيذ جميع انظمة التيار الخفيف من البنية التحتية لكبلات النحاس و الفايبر تنفيذ اعمال انظمة كاميرات المراقبة و انذار الحريق و الصوتيات و الدش المركزي'
  },
  {
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    title: 'مصنع أندريا وجورج للذهب',
    desc: 'تنفيذ جميع أنظمة التيار الخفيف من مرحلة الأعمال التأسيسية حتى مرحلة التشغيل، وتشمل: أنظمة المراقبة بالكاميرات، التحكم في الدخول، إنذار الحريق، الإذاعة الداخلية، البنية التحتية للنحاس والألياف الضوئية، ونظام السنترال.'
  }
];

// Cloudinary URL helpers
const imgThumb = (src) => src.replace('/upload/', '/upload/w_20,h_14,c_fill,q_10,f_webp/');
const imgFull  = (src) => src.replace('/upload/', '/upload/w_280,h_200,c_fill,q_auto,f_webp/');

function LazyImage({ src, alt }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = imgFull(src);
          img.onload = () => setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={ref} className="project-image" style={{ background: '#e0e0e0', position: 'relative', overflow: 'hidden' }}>
      {/* tiny blurred placeholder — loads instantly */}
      <img
        src={imgThumb(src)}
        alt=""
        aria-hidden="true"
        width={280}
        height={200}
        style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'blur(8px)', transform: 'scale(1.1)', position: 'absolute', inset: 0 }}
      />
      {/* full quality image fades in */}
      {loaded && (
        <img
          src={imgFull(src)}
          alt={alt}
          width={280}
          height={200}
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0, animation: 'fadeIn 0.4s ease' }}
        />
      )}
    </div>
  );
}

export default function Projects() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
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
            {projects.map((project, i) => (
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <Link 
            to="/projects"
            style={buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            المزيد
          </Link>
        </div>
      </section>
    </>
  );
}
