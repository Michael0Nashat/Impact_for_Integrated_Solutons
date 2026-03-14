import { useState, useEffect, useRef } from 'react';

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
  .scroll-container { overflow: hidden; width: 100%; margin-top: 40px; }
  .scroll-row { display: flex; width: max-content; gap: 12px; margin-bottom: 12px; }
  .scroll-right { animation: scrollRight 80s linear infinite; }
  .video-row-centered { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px; width: 100%; padding: 0 5%; box-sizing: border-box; }
  .video-row-centered .project-video { width: 100%; }
  .project-image { flex-shrink: 0; width: 200px; height: 140px; overflow: hidden; border-radius: 12px; transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  .project-image:hover { transform: scale(1.05); }
  .project-image img { object-fit: cover; width: 100%; height: 100%; }
  .project-video { flex-shrink: 0; width: 200px; height: 140px; overflow: hidden; border-radius: 12px; transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  .project-video:hover { transform: scale(1.05); }
  .project-video video { object-fit: cover; width: 100%; height: 100%; }
  @media (min-width: 769px) {
    .scroll-row { gap: 20px; margin-bottom: 20px; }
    .video-row-centered { display: flex; gap: 20px; margin-bottom: 20px; justify-content: center; padding: 0; grid-template-columns: unset; }
    .video-row-centered .project-video { width: 280px; }
    .project-image { width: 280px; height: 200px; border-radius: 15px; }
    .project-video { width: 280px; height: 200px; border-radius: 15px; }
    .scroll-container { margin-top: 60px; }
  }
`;

const projectImages = [
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
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418094/6C6B04C1-9951-40DE-8386-CB790385A7DE_uhuytm.mp4',
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418446/IMG_0879_yq5rms.mp4',
  'https://res.cloudinary.com/dk9ss8rxl/video/upload/v1773418411/IMG_0877_aigoen.mp4'
];

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
const vidPoster = (src) => src.replace('/video/upload/', '/image/upload/w_280,h_200,c_fill,q_auto,f_webp/').replace(/\.mp4$/, '.jpg');

function LazyImage({ src, alt }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // use scroll-container parent as root so observer fires inside overflow:hidden
    const root = el.closest('.scroll-container') || null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = imgFull(src);
          img.onload = () => setLoaded(true);
          observer.disconnect();
        }
      },
      { root, threshold: 0, rootMargin: '0px 400px 0px 400px' }
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

function LazyVideo({ src }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0, rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="project-video">
      {inView ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={vidPoster(src)}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // show poster immediately before video loads
        <img
          src={vidPoster(src)}
          alt=""
          aria-hidden="true"
          width={280}
          height={200}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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

        <div className="scroll-container">
          <div className="scroll-row scroll-right">
            {[...projectImages, ...projectImages].map((img, i) => (
              <LazyImage key={`project-img-${i}`} src={img} alt={`مشروع ${i + 1}`} />
            ))}
          </div>
          {isMounted && (
            <div className="video-row-centered">
              {projectVideos.map((vid, i) => (
                <LazyVideo key={`project-vid-${i}`} src={vid} />
              ))}
            </div>
          )}
        </div>

        <div style={buttonContainerStyle}>
          <a 
            href="/projects"
            style={buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            المزيد
          </a>
        </div>
      </section>
    </>
  );
}
