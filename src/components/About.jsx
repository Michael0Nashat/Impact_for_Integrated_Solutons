import { useEffect, useState } from 'react';
import { API, DEFAULT_ABOUT } from '../dashboard/useDashboardData';

const aboutStyles = `
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

export default function About() {
  const [data, setData] = useState(DEFAULT_ABOUT);
  const [isLoading, setIsLoading] = useState(true);
  const [imgTs, setImgTs] = useState(() => Date.now());
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        // Try to load from localStorage first for instant display
        const cached = localStorage.getItem('about_data');
        if (cached) {
          const parsed = JSON.parse(cached);
          setData(parsed);
          setIsLoading(false);
          setImgTs(Date.now());
        }
        
        // Fetch fresh data in background
        const response = await fetch(`${API}/settings/about`);
        const d = await response.json();
        if (d) {
          setData(d);
          localStorage.setItem('about_data', JSON.stringify(d));
          setImgTs(Date.now());
        }
      } catch (error) {
        console.error('Error loading about:', error);
        // Use cached data if available on error
        const cached = localStorage.getItem('about_data');
        if (cached) setData(JSON.parse(cached));
      } finally {
        setIsLoading(false);
      }
    };

    loadAbout();
    window.addEventListener('about-updated', loadAbout);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('about-updated', loadAbout);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setIsVisible(true); }),
      { threshold: 0.1 }
    );
    const section = document.getElementById('about');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, [data]);

  const sectionStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: isMobile ? '30px' : '60px', marginTop: isMobile ? '50px' : '80px',
    flexWrap: 'wrap', padding: isMobile ? '0 5%' : '0 8%',
  };

  const textContainerStyle = {
    textAlign: 'right', flex: 1, minWidth: isMobile ? '100%' : 'auto',
    order: isMobile ? 2 : 1, opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
    transition: 'all 0.8s ease-out',
  };

  const imageContainerStyle = {
    flex: 1, textAlign: isMobile ? 'center' : 'left',
    minWidth: isMobile ? '100%' : 'auto', order: isMobile ? 1 : 2,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-50px) scale(0.95)',
    transition: 'all 0.8s ease-out 0.3s',
  };

  const imageStyle = {
    width: '100%', maxWidth: isMobile ? '100%' : '550px',
    borderRadius: isMobile ? '20px' : '30px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  // Skeleton loader styles
  const skeletonStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  if (isLoading && !data) {
    return (
      <section id="about" style={{ ...sectionStyle, minHeight: '400px', padding: isMobile ? '80px 5%' : '80px 8%' }}>
        <div style={{ ...textContainerStyle, ...skeletonStyle }}>
          <div style={{ height: '36px', width: '60%', marginBottom: '20px' }} />
          <div style={{ height: '18px', width: '95%', marginBottom: '10px' }} />
          <div style={{ height: '18px', width: '90%', marginBottom: '10px' }} />
          <div style={{ height: '18px', width: '85%' }} />
        </div>
        <div style={{ ...imageContainerStyle, ...skeletonStyle, height: '400px' }} />
      </section>
    );
  }

  return (
    <>
      <style>{aboutStyles}</style>
      <section id="about" style={sectionStyle}>
        <div style={textContainerStyle}>
          <h2 style={{ fontSize: isMobile ? '28px' : '36px', marginBottom: '20px', animation: isVisible ? 'fadeInRight 0.8s ease-out' : 'none' }}>
            {data.title}
          </h2>
          <p style={{ lineHeight: '2', color: '#555', fontSize: isMobile ? '15px' : '17px', animation: isVisible ? 'fadeInRight 0.8s ease-out 0.2s both' : 'none' }}>
            {data.text}
          </p>
        </div>
        <div style={imageContainerStyle}>
          <img
            src={data.image?.startsWith('data:') ? data.image : `${data.image}?t=${imgTs}`}
            key={data.image}
            style={imageStyle}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 50px 120px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 40px 100px rgba(0,0,0,0.15)'; }}
          />
        </div>
      </section>
    </>
  );
}
