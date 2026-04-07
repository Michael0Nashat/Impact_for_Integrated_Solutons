import { useState, useEffect, useRef } from 'react';
import { API } from '../dashboard/useDashboardData';

const projectVideos = [
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418897/07F5CAC5-FBAC-466C-A3E8-EE36EF2F2AAA_ejisyy.mp4',
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418446/IMG_0879_yq5rms.mp4',
];

const partnersStyles = `
  @-webkit-keyframes scrollRight {
    0% { -webkit-transform: translateX(0); transform: translateX(0); }
    100% { -webkit-transform: translateX(50%); transform: translateX(50%); }
  }
  @keyframes scrollRight {
    0% { -webkit-transform: translateX(0); transform: translateX(0); }
    100% { -webkit-transform: translateX(50%); transform: translateX(50%); }
  }
  @-webkit-keyframes scrollLeft {
    0% { -webkit-transform: translateX(0); transform: translateX(0); }
    100% { -webkit-transform: translateX(-50%); transform: translateX(-50%); }
  }
  @keyframes scrollLeft {
    0% { -webkit-transform: translateX(0); transform: translateX(0); }
    100% { -webkit-transform: translateX(-50%); transform: translateX(-50%); }
  }
  @-webkit-keyframes float {
    0%, 100% { -webkit-transform: translateY(0px) rotate(0deg); transform: translateY(0px) rotate(0deg); }
    50% { -webkit-transform: translateY(-10px) rotate(2deg); transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
  .scroll-container { 
    overflow: hidden; 
    width: 100vw; 
    position: relative; 
    left: 50%; 
    right: 50%; 
    margin-left: -50vw; 
    margin-right: -50vw; 
    margin-top: 60px; 
  }
  .scroll-row { 
    display: -webkit-box;
    display: -webkit-flex;
    display: flex; 
    width: max-content; 
    gap: 40px; 
    margin-bottom: 30px; 
    will-change: transform; 
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .scroll-right {
    -webkit-animation: scrollRight 120s linear infinite;
    animation: scrollRight 120s linear infinite;
  }
  .scroll-projects {
    -webkit-animation: scrollRight 120s linear infinite;
    animation: scrollRight 120s linear infinite;
  }
  .scroll-left {
    -webkit-animation: scrollLeft 120s linear infinite;
    animation: scrollLeft 120s linear infinite;
  }
  .brand-logo { flex-shrink: 0; width: 160px; height: 160px; overflow: hidden; transition: transform 0.3s ease; background: transparent; display: flex; align-items: center; justify-content: center; padding: 15px; }
  .brand-logo img { object-fit: contain; -webkit-object-fit: contain; }
  .brand-logo:hover { transform: scale(1.1); }
  .customer-logo { 
    -webkit-flex-shrink: 0;
    flex-shrink: 0; 
    width: 160px; 
    height: 160px; 
    overflow: hidden; 
    transition: transform 0.3s ease; 
    background: transparent; 
    display: -webkit-box;
    display: -webkit-flex;
    display: flex; 
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center; 
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center; 
    padding: 15px; 
  }
  .customer-logo:hover { transform: scale(1.1); }
  .brands-container { position: relative; width: 100%; min-height: 500px; padding: 40px 20px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 20px; }
  @media (max-width: 768px) { 
    .brands-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 20px 10px; min-height: unset; } 
    .brand-item { width: 100% !important; height: auto !important; aspect-ratio: 1; } 
    .brand-logo { width: 100% !important; height: 100% !important; }
    .scroll-row { gap: 20px; margin-bottom: 20px; }
    .project-sample-item { width: 200px !important; min-width: 200px !important; height: 240px !important; }
    .project-video-item { width: 220px !important; height: 165px !important; }
  }
  .brand-item { position: relative; -webkit-animation: float 3s ease-in-out infinite; animation: float 3s ease-in-out infinite; }
  .brand-item:nth-child(odd) { -webkit-animation-delay: 0.5s; animation-delay: 0.5s; }
  .brand-item:nth-child(3n) { -webkit-animation-delay: 1s; animation-delay: 1s; }
  .brand-item:nth-child(4n) { -webkit-animation-delay: 1.5s; animation-delay: 1.5s; }
  .project-sample-item {
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    width: 280px;
    min-width: 280px;
    height: 300px;
    overflow: hidden;
    -webkit-transition: transform 0.3s ease;
    transition: transform 0.3s ease;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 12px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    background: rgba(0,0,0,0.03);
  }
  .project-sample-item img { -webkit-object-fit: contain; object-fit: contain; width: 100%; height: 100%; -webkit-image-rendering: -webkit-optimize-contrast; image-rendering: -webkit-optimize-contrast; }
  .project-sample-item:hover { transform: scale(1.05); }
  .project-video-item {
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    width: 300px;
    height: 225px;
    overflow: hidden;
    border-radius: 12px;
    -webkit-transition: transform 0.3s ease;
    transition: transform 0.3s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .project-video-item video { -webkit-object-fit: cover; object-fit: cover; width: 100%; height: 100%; display: block; }
  .project-video-item:hover { transform: scale(1.05); }
`;

const customerLogos = [
  '5.png',
  '6.png',
  'images.png',
  '3.png',
  '4.png',
  '7.png',
  '8.png',
  '9.png',
  '10.png',
  '13.png',
  '14.png',
  '15.png',
  '16.png',
  '17.png',
  '18.png'
];



function LazyVideo({ src }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  const optimizedSrc = src.replace('/video/upload/', '/video/upload/w_600,h_450,c_fill,q_40,vc_auto/');

  const poster = src
    .replace('/video/upload/', '/video/upload/w_600,h_450,c_fill,so_0,q_auto,f_auto/')
    .replace(/\.mp4$/, '.jpg');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <video
        ref={videoRef}
        src={optimizedSrc}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        webkit-playsinline="true"
        x5-playsinline="true"
        onError={(e) => {
          if (e.target.poster) {
            e.target.removeAttribute('poster');
          }
        }}
        style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}

export default function Partners() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const [projectSamples, setProjectSamples] = useState([]);


  useEffect(() => {
    let resizeTimeout;
    const checkMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 200);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);

    fetch(`${API}/brands`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && setBrands(data))
      .catch(() => { });

    fetch(`${API}/project-samples`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && data.length > 0 && setProjectSamples(data.map(d => d.img)))
      .catch(() => { });

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const sectionStyle = {
    padding: isMobile ? '0 5%' : '0 8%',
    marginTop: isMobile ? '50px' : '80px'
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: isMobile ? '30px' : '40px',
    marginBottom: isMobile ? '40px' : '60px',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'all 0.6s ease-out'
  };

  return (
    <>
      <style>{partnersStyles}</style>
      <section id="partners" ref={sectionRef} style={sectionStyle}>

        <h3 style={{
          textAlign: 'center',
          fontSize: isMobile ? '20px' : '28px',
          marginTop: '50px',
          marginBottom: '8px',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.6s ease-out 0.4s'
        }}>
          أمثلة من مشاريعنا
        </h3>
        <div className="scroll-container" style={{ marginTop: '16px' }}>
          <div className="scroll-row scroll-projects">
            {[...projectSamples, ...projectSamples].map((src, i) => (
              <div key={`sample-${i}`} className="project-sample-item">
                <img
                  src={src.replace('/upload/', '/upload/q_auto,f_jpg/')}
                  alt={`مشروع ${i + 1}`}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>


        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: isMobile ? '15px' : '30px',
          marginTop: '20px'
        }}>
          {projectVideos.map((src, i) => (
            <div key={`video-${i}`} className="project-video-item">
              <LazyVideo src={src} />
            </div>
          ))}
        </div>


        <h2 style={{ ...headingStyle, marginTop: '80px' }}>شركاؤنا</h2>

        <div className="scroll-container">
          <div className="scroll-row scroll-right">
            {[...customerLogos, ...customerLogos].map((logo, i) => (
              <div key={`customer-${i}`} className="customer-logo">
                <img
                  src={`/q/${logo}`}
                  alt={`Customer ${logo}`}
                  width={160}
                  height={160}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>


        <h3 style={{
          textAlign: 'center',
          fontSize: isMobile ? '24px' : '32px',
          marginTop: '60px',
          marginBottom: '40px',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.6s ease-out 0.3s'
        }}>
          علامات تجارية
        </h3>

        <div className="brands-container">
          {brands.map((brand, i) => {
            const size = 140;
            return (
              <div
                key={`brand-${brand.id}`}
                className="brand-item"
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                <div className="brand-logo" style={{ width: '100%', height: '100%' }}>
                  <img
                    src={brand.img}
                    alt={brand.name || `Brand ${i + 1}`}
                    width={size}
                    height={size}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </>
  );
}