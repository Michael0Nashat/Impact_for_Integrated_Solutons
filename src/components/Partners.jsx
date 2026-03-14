import { useState, useEffect } from 'react';

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

export default function Partners() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
        <h2 style={headingStyle}>شركاؤنا</h2>

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