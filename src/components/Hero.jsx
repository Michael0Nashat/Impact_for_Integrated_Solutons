import { useEffect, useState } from 'react';
import { API } from '../dashboard/useDashboardData';

const heroStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatImage {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 30px rgba(255,193,7,0.15); }
    50% { box-shadow: 0 30px 80px rgba(0,0,0,0.2), 0 0 60px rgba(255,193,7,0.35); }
  }
  @keyframes imageEntrance {
    from { opacity: 0; transform: translateX(-60px) scale(0.9) rotate(-3deg); }
    to { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
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
  const [isImageHovered, setIsImageHovered] = useState(false);
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
    setTimeout(() => setIsVisible(true), 100);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('hero-updated', loadHero);
    };
  }, []);

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
  };

  const imageStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '650px',
    height: 'auto',
    borderRadius: isMobile ? '16px' : '30px',
    display: 'block',
    animation: isVisible
      ? isImageHovered
        ? 'glowPulse 1.5s ease-in-out infinite'
        : 'imageEntrance 0.9s ease-out both, floatImage 4s ease-in-out 0.9s infinite, glowPulse 3s ease-in-out 0.9s infinite'
      : 'none',
    transform: isImageHovered ? 'scale(1.04)' : 'scale(1)',
    transition: 'transform 0.4s ease',
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
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
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
