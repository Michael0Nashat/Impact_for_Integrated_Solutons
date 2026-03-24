import { useEffect, useState } from 'react';
import { API } from '../dashboard/useDashboardData';

const heroStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    #hero {
      padding: 100px 5% 40px !important;
      flex-direction: column !important;
      gap: 24px !important;
      min-height: unset !important;
    }
    #hero img {
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 16px !important;
    }
    #hero h1 {
      font-size: 24px !important;
      line-height: 1.5 !important;
    }
    #hero p {
      font-size: 14px !important;
    }
  }
`;

export default function Hero() {
  const [data, setData] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [imgTs, setImgTs] = useState(() => Date.now());

  useEffect(() => {
    const loadHero = () => {
      fetch(`${API}/settings/hero`)
        .then(r => r.json())
        .then(d => { if (d) { setData(d); setImgTs(Date.now()); } })
        .catch(() => {});
    };

    loadHero();

    // re-fetch when dashboard saves (custom event)
    window.addEventListener('hero-updated', loadHero);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('hero-updated', loadHero);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    // Hero is always at top of page, use a short delay instead of IntersectionObserver
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  const sectionStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: isMobile ? '100px 5% 40px' : '180px 8% 60px',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '24px' : '60px',
    width: '100%', boxSizing: 'border-box',
  };

  const imageContainerStyle = {
    width: isMobile ? '100%' : 'auto',
    flex: isMobile ? 'unset' : 1,
    textAlign: 'center',
    order: isMobile ? 2 : 1,
    maxWidth: isMobile ? '100%' : '45%',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-50px) scale(0.95)',
    transition: 'all 0.8s ease-out 0.3s',
  };

  const imageStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '650px',
    height: 'auto',
    borderRadius: isMobile ? '16px' : '30px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'block',
  };

  const contentStyle = {
    width: isMobile ? '100%' : 'auto',
    flex: isMobile ? 'unset' : 1,
    textAlign: 'right',
    order: isMobile ? 1 : 2,
    maxWidth: isMobile ? '100%' : '45%',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
    transition: 'all 0.8s ease-out 0.2s',
  };

  const headingStyle = {
    fontSize: isMobile ? '24px' : '42px', marginBottom: '16px',
    lineHeight: isMobile ? '1.5' : '1.2',
    animation: isVisible ? 'fadeInUp 0.8s ease-out 0.3s both' : 'none',
  };

  const buttonStyle = {
    display: 'inline-block', padding: isMobile ? '14px 32px' : '16px 44px',
    backgroundColor: isButtonHovered ? '#e0a800' : '#ffc107',
    color: 'black', borderRadius: '30px', fontWeight: 'bold',
    textDecoration: 'none', transition: 'all 0.3s ease',
    fontSize: isMobile ? '14px' : '16px',
    transform: isButtonHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
    boxShadow: isButtonHovered ? '0 10px 25px rgba(255,193,7,0.4)' : '0 5px 15px rgba(255,193,7,0.2)',
    animation: isVisible ? 'fadeInUp 0.8s ease-out 0.7s both' : 'none',
  };

  if (!data) return null;

  return (
    <>
      <style>{heroStyles}</style>
      <section id="hero" style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img
            src={data.image ? (data.image.startsWith('data:') ? data.image : `${data.image}?t=${imgTs}`) : ''}
            alt="Hero" style={imageStyle}
            key={data.image}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 50px 120px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 40px 100px rgba(0,0,0,0.15)'; }}
          />
        </div>
        <div style={contentStyle}>
          <h1 style={headingStyle}>{data.title}</h1>
          <p style={{ lineHeight: '2', marginBottom: '32px', color: '#555', fontSize: isMobile ? '15px' : '16px', animation: isVisible ? 'fadeInUp 0.8s ease-out 0.5s both' : 'none' }}>
            {data.subtitle}
          </p>
          <a
            href={data.btnLink} style={buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {data.btnText}
          </a>
        </div>
      </section>
    </>
  );
}
