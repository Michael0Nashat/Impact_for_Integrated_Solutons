import { useEffect, useState, useCallback, useMemo } from 'react';

const services = [
  { icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006363.png', title: 'تطوير المواقع', desc: 'تصميم وبرمجة مواقع حديثة وسريعة للشركات.' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/888/888879.png', title: 'تطبيقات الموبايل', desc: 'برمجة تطبيقات Android و iOS باحترافية.' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png', title: 'أنظمة ERP', desc: 'أنظمة إدارة الشركات والمخازن والمبيعات.' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/4248/4248443.png', title: 'التسويق الإلكتروني', desc: 'إدارة الحملات الإعلانية والسوشيال ميديا.' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png', title: 'تصميم UI/UX', desc: 'تصميم واجهات احترافية سهلة الاستخدام.' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png', title: 'تحليل البيانات', desc: 'تحليل بيانات الشركات واتخاذ قرارات ذكية.' }
];

export default function Services() {
  const [visibleBoxes, setVisibleBoxes] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setVisibleBoxes(prev => {
            if (prev.includes(index)) return prev;
            return [...prev, index];
          });
        }
      });
    }, { threshold: 0.1 });

    const boxes = document.querySelectorAll('.service-box');
    boxes.forEach(box => observer.observe(box));
    
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const sectionStyle = useMemo(() => ({
    padding: isMobile ? '0 5%' : '0 8%',
    marginTop: isMobile ? '50px' : '80px'
  }), [isMobile]);

  const headingStyle = useMemo(() => ({
    textAlign: 'center',
    fontSize: isMobile ? '30px' : '40px',
    marginBottom: isMobile ? '40px' : '60px',
    opacity: visibleBoxes.length > 0 ? 1 : 0,
    transform: visibleBoxes.length > 0 ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'all 0.6s ease-out'
  }), [isMobile, visibleBoxes.length]);

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '24px' : '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'stretch'
  }), [isMobile]);

  const getBoxStyle = useCallback((index) => ({
    background: hoveredIndex === index 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 255, 0.9))'
      : 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: isMobile ? '12px' : '20px',
    padding: isMobile ? '24px' : '32px',
    textAlign: 'center',
    boxShadow: hoveredIndex === index 
      ? '0 20px 40px rgba(0, 0, 0, 0.2)' 
      : '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: hoveredIndex === index ? '2px solid rgba(100, 100, 255, 0.3)' : '2px solid transparent',
    transition: 'all 0.3s ease',
    opacity: visibleBoxes.includes(index) ? 1 : 0,
    transform: visibleBoxes.includes(index) 
      ? (hoveredIndex === index && !isMobile ? 'translateY(-15px) scale(1.05)' : 'translateY(0)')
      : 'translateY(80px)',
    transitionDelay: `${index * 0.1}s`,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: isMobile ? 'auto' : '280px',
    willChange: hoveredIndex === index ? 'transform, box-shadow' : 'auto'
  }), [hoveredIndex, isMobile, visibleBoxes]);

  const iconStyle = useCallback((index) => ({
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'transform 0.4s ease',
    transform: hoveredIndex === index ? 'rotate(10deg) scale(1.15)' : 'rotate(0) scale(1)',
    filter: hoveredIndex === index ? 'brightness(1.1)' : 'brightness(1)',
    willChange: hoveredIndex === index ? 'transform' : 'auto'
  }), [hoveredIndex]);

  const titleStyle = useMemo(() => ({
    marginBottom: '12px'
  }), []);

  const descStyle = useMemo(() => ({
    color: '#333',
    fontSize: '14px'
  }), []);

  return (
    <section id="services" style={sectionStyle}>
      <h2 style={headingStyle}>مجالات العمل</h2>
      <div style={gridStyle}>
        {services.map((service, i) => (
          <div 
            key={i}
            data-index={i}
            className="service-box"
            style={getBoxStyle(i)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img 
              src={service.icon} 
              alt={service.title} 
              width={80} 
              height={80} 
              style={iconStyle(i)}
            />
            <h3 style={titleStyle}>{service.title}</h3>
            <p style={descStyle}>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
