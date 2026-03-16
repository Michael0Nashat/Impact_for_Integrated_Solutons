import { useState, useEffect, useRef } from 'react';

const sampleProjectImages = [
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481623/IMG_0421_holfs0.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481617/IMG_0422_nx9y15.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481614/IMG_0436_ihs3ml.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481595/IMG_0433_cff2mn.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481578/IMG_0370_wmgj12.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481552/IMG_0456_lfwwbr.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481497/IMG_1306_hputdm.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481475/ACBD4F43-8BE8-49C8-BEF3-1DA83C8DD56D_okvlko.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481474/WhatsApp_Image_2025-07-22_at_15.00.55_61bf7ca1_cwloka.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481467/IMG_1105_x4nl9t.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481465/3E2BED8F-1649-47CA-A00B-D0C890237A20_sudhf5.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481462/WhatsApp_Image_2025-07-22_at_15.00.53_e963a71d_ryh8iz.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481460/WhatsApp_Image_2025-07-22_at_15.00.54_605b8a75_kmmwiw.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481459/IMG_1318_p9dzgv.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481458/IMG_1327_ebr2nm.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481451/WhatsApp_Image_2025-07-22_at_15.00.54_2b168ceb_tnakp0.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481439/IMG_0902_pirc8g.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481434/IMG_0890_zc8did.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481425/IMG_0901_nlk9nj.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481407/IMG_0883_p750qx.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481407/IMG_1092_zxcsiu.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481407/IMG_1093_eal4ug.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481403/IMG_1079_iokslv.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481398/IMG_0880_qjfibb.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481398/IMG_0937_ekiw2u.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481394/IMG_0936_pzjspv.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481390/IMG_0836_u7ah9u.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481379/IMG_0889_u76clr.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481365/IMG_0879_ed4vu2.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481360/IMG_0826_mtge7z.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481323/IMG_0792_begbjy.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481304/IMG_0701_h99ywh.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481292/IMG_0852_vda3ub.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481288/IMG_0853_wbmcqd.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481283/IMG_0837_bhzac8.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481276/IMG_0850_qrjhru.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481232/IMG_0514_pakddr.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481228/IMG_0537_zjmdjj.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481227/IMG_0587_pmdf0h.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481220/IMG_0518_cz8ahh.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481213/IMG_0506_jkczig.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481210/IMG_0497_owjlja.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481209/IMG_0499_akz56k.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481209/IMG_0479_mapwex.jpg',
  'https://res.cloudinary.com/dk9ss8rxl/image/upload/v1773481205/IMG_0460_vnkdsp.jpg',
];

const projectVideos = [
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418897/07F5CAC5-FBAC-466C-A3E8-EE36EF2F2AAA_ejisyy.mp4',
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418446/IMG_0879_yq5rms.mp4',
];

const partnersStyles = `
  @keyframes scrollRight {
    0% { transform: translateX(0); }
    100% { transform: translateX(50%); }
  }
  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
  .scroll-container { overflow: hidden; width: 100%; margin-top: 60px; }
  .scroll-row { display: flex; width: max-content; gap: 40px; margin-bottom: 30px; }
  .scroll-right { animation: scrollRight 60s linear infinite; }
  .scroll-left { animation: scrollLeft 60s linear infinite; }
  .brand-logo { flex-shrink: 0; width: 120px; height: 120px; overflow: hidden; transition: transform 0.3s ease; background: transparent; display: flex; align-items: center; justify-content: center; padding: 15px; }
  .brand-logo img { object-fit: contain; }
  .brand-logo:hover { transform: scale(1.1); }
  .customer-logo { flex-shrink: 0; width: 120px; height: 120px; overflow: hidden; transition: transform 0.3s ease; background: transparent; display: flex; align-items: center; justify-content: center; padding: 15px; }
  .customer-logo:hover { transform: scale(1.1); }
  .brands-container { position: relative; width: 100%; min-height: 500px; padding: 40px 20px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 20px; }
  .brand-item { position: relative; animation: float 3s ease-in-out infinite; }
  .brand-item:nth-child(odd) { animation-delay: 0.5s; }
  .brand-item:nth-child(3n) { animation-delay: 1s; }
  .brand-item:nth-child(4n) { animation-delay: 1.5s; }
  .project-sample-item { flex-shrink: 0; width: 260px; height: 195px; overflow: hidden; transition: transform 0.3s ease; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
  .project-sample-item img { object-fit: cover; width: 100%; height: 100%; }
  .project-sample-item:hover { transform: scale(1.04); }
  .project-video-item { flex-shrink: 0; width: 220px; height: 165px; overflow: hidden; border-radius: 12px; transition: transform 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .project-video-item video { object-fit: cover; width: 100%; height: 100%; display: block; }
  .project-video-item:hover { transform: scale(1.04); }
`;

const customerLogos = [
  '6.png',
  'images.png',
  '3.png',
  '4.png',
  '5.png',
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

const brandLogos = [
  '1.png',
  'logo_transparent.png',
  '2.png',
  '4.png',
  'premium-line-logo.png',
  '6.png',
  'IMG-20260311-WA0024.jpg',
  'apollo.png',
  '9.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  'Panasonic_Group_logo.png',
  'gerrett.png',
  '16.png',
  '17.png',
  '18.png',
  '19.png',
  '20.png',
  '3.png',
  '21.png',
  '22.png',
  '24.png',
  'dlink.png'
];

function LazyScrollImage({ src, alt, width, height }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '300px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width, height, borderRadius: 'inherit', overflow: 'hidden' }}>
      {visible && <img src={src} alt={alt} width={width} height={height} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />}
    </div>
  );
}

function LazyVideo({ src }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  const optimizedSrc = src.replace('/video/upload/', '/video/upload/w_400,h_300,c_fill,q_40,vc_auto/');

  const poster = src
    .replace('/video/upload/', '/image/upload/w_400,h_300,c_fill,q_auto,f_webp/')
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
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <div ref={ref} className="project-video-item" style={{ width: '100%', height: 'inherit' }}>
      <video
        ref={videoRef}
        src={optimizedSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}

export default function Partners() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

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

    const section = document.getElementById('partners');
    if (section) observer.observe(section);
    
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
      <section id="partners" style={sectionStyle}>

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
          <div className="scroll-row scroll-right" style={{ animationDuration: '240s' }}>
            {[...sampleProjectImages, ...sampleProjectImages].map((src, i) => (
              <div key={`sample-${i}`} className="project-sample-item">
                <LazyScrollImage
                  src={src.replace('/upload/', '/upload/w_520,h_390,c_fill,q_auto,f_webp/')}
                  alt={`مشروع ${i + 1}`}
                  width={260}
                  height={195}
                />
              </div>
            ))}
          </div>
        </div>

        {/* More button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {!showGrid && (
            <button
              onClick={() => setShowGrid(true)}
              style={{
                padding: isMobile ? '12px 28px' : '14px 40px',
                background: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: isMobile ? '14px' : '16px',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(255,193,7,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              المزيد
            </button>
          )}
        </div>

        {/* Grid of all sample images */}
        {showGrid && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? '8px' : '12px',
            marginTop: '24px',
            padding: isMobile ? '0' : '0 2%'
          }}>
            {sampleProjectImages.map((src, i) => (
              <div key={`grid-${i}`} style={{
                aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
              }}>
                <img
                  src={src.replace('/upload/', '/upload/w_520,h_390,c_fill,q_auto,f_webp/')}
                  alt={`مشروع ${i + 1}`}
                  loading="lazy"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            ))}
          </div>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '20px'
        }}>
          {projectVideos.map((src, i) => (
            <div key={`video-${i}`} style={{ width: isMobile ? 'calc(50% - 8px)' : '300px', height: isMobile ? '140px' : '165px' }}>
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
                  width={120}
                  height={120}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
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
          {brandLogos.map((logo, i) => {
            const size = 100;
            
            return (
              <div 
                key={`brand-${i}`} 
                className="brand-item"
                style={{
                  width: `${size}px`,
                  height: `${size}px`
                }}
              >
                <div className="brand-logo" style={{ width: '100%', height: '100%' }}>
                  <img 
                    src={`/Brands Logos/${logo}`} 
                    alt={`Brand ${logo}`}
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