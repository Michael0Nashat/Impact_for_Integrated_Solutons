import { useState, useEffect, useRef } from 'react';
import { API } from '../dashboard/useDashboardData';

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
  .project-video-item iframe { width: 100%; height: 100%; display: block; border: 0; }
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

function getYouTubeId(url) {
  if (!url) return null;
  // Covers: watch?v=, youtu.be/, embed/, shorts/, live/, m.youtube.com,
  // youtube-nocookie.com, with or without extra query params like &t=10s
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/watch\?(?:.*&)?v=([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/shorts\/([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/live\/([\w-]{11})/,
    /youtube\.com\/v\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

function getVimeoId(url) {
  if (!url) return null;
  // Covers: vimeo.com/ID, player.vimeo.com/video/ID,
  // vimeo.com/channels/xxx/ID, vimeo.com/groups/xxx/videos/ID
  const patterns = [
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/(?:channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)/,
  ];
  for (const re of patterns) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

function getStreamableId(url) {
  if (!url) return null;
  // Covers: streamable.com/ID and the already-embeddable streamable.com/e/ID
  const match = url.match(/streamable\.com\/(?:e\/)?([\w]+)/);
  return match ? match[1] : null;
}

function getGoogleDriveId(url) {
  if (!url) return null;
  // Covers: drive.google.com/file/d/ID/view and drive.google.com/open?id=ID
  const fileMatch = url.match(/\/d\/([^/?]+)/);
  if (fileMatch) return fileMatch[1];
  const openMatch = url.match(/[?&]id=([^&]+)/);
  return openMatch ? openMatch[1] : null;
}

// Facebook refuses to be embedded in a plain iframe (it sends
// X-Frame-Options/CSP headers that block it), so it needs its own
// official embed plugin URL instead of the generic iframe fallback.
function getFacebookEmbedSrc(url) {
  if (!url) return null;
  if (!/facebook\.com|fb\.watch/.test(url)) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
}

// Detect the real provider from the URL itself, so a video still plays
// correctly even if the wrong provider was picked when it was added.
function detectProvider(url) {
  if (!url) return null;
  if (/youtu\.be|youtube(?:-nocookie)?\.com/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  if (/streamable\.com/.test(url)) return 'streamable';
  if (/drive\.google\.com/.test(url)) return 'google_drive';
  if (/facebook\.com|fb\.watch/.test(url)) return 'facebook';
  if (/res\.cloudinary\.com/.test(url)) return 'cloudinary';
  if (/\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url)) return 'mp4';
  return null;
}

function LazyVideo({ src }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  const isCloudinary = src.includes('res.cloudinary.com') && src.includes('/video/upload/');

  const optimizedSrc = isCloudinary
    ? src.replace('/video/upload/', '/video/upload/w_600,h_450,c_fill,q_40,vc_auto/')
    : src;

  const poster = isCloudinary
    ? src
        .replace('/video/upload/', '/video/upload/w_600,h_450,c_fill,so_0,q_auto,f_auto/')
        .replace(/\.mp4$/, '.jpg')
    : undefined;

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

function VideoEmbed({ video }) {
  const src = video.url || '';
  if (!src) return null;

  // Trust the URL pattern over the stored provider field — this way a
  // video still renders correctly even if the wrong provider was picked
  // (or left on the default) when it was added in the admin panel.
  const provider = detectProvider(src) || (video.provider || '').toLowerCase();

  if (provider === 'youtube') {
    const id = getYouTubeId(src);
    if (id) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={video.title || 'YouTube video'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  if (provider === 'vimeo') {
    const id = getVimeoId(src);
    if (id) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          title={video.title || 'Vimeo video'}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  if (provider === 'streamable') {
    const id = getStreamableId(src);
    if (id) {
      return (
        <iframe
          src={`https://streamable.com/e/${id}`}
          title={video.title || 'Streamable video'}
          loading="lazy"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
  }

  if (provider === 'google_drive') {
    const id = getGoogleDriveId(src);
    if (id) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${id}/preview`}
          title={video.title || 'Google Drive video'}
          loading="lazy"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
  }

  if (provider === 'facebook') {
    const embedSrc = getFacebookEmbedSrc(src);
    if (embedSrc) {
      return (
        <iframe
          src={embedSrc}
          title={video.title || 'Facebook video'}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0, overflow: 'hidden' }}
        />
      );
    }
  }

  if (provider === 'cloudinary' || provider === 'mp4') {
    return <LazyVideo src={src} />;
  }

  // Last resort: try to pull an ID out of the raw URL regardless of what
  // the provider field said.
  const fallbackYouTubeId = getYouTubeId(src);
  if (fallbackYouTubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${fallbackYouTubeId}`}
        title={video.title || 'YouTube video'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const fallbackVimeoId = getVimeoId(src);
  if (fallbackVimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${fallbackVimeoId}`}
        title={video.title || 'Vimeo video'}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // A direct video file link (mp4/webm/mov...) with no matching platform.
  if (/\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(src)) {
    return <LazyVideo src={src} />;
  }

  // Anything else (Jumpshare or any other host that supports iframe embeds).
  return (
    <iframe
      src={src}
      title={video.title || 'Embedded video'}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      style={{ border: 0 }}
    />
  );
}

export default function Partners() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const [projectSamples, setProjectSamples] = useState([]);
  const [projectVideos, setProjectVideos] = useState([]);


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

    fetch(`${API}/project-videos`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && setProjectVideos(data))
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


        {projectVideos.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? '15px' : '30px',
            marginTop: '20px'
          }}>
            {projectVideos.map((video) => (
              <div key={`video-${video.id}`} className="project-video-item">
                <VideoEmbed video={video} />
              </div>
            ))}
          </div>
        )}


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