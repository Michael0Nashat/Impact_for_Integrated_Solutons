import { useEffect, useState } from 'react';

const heroStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Hero() {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const sectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '120px 5% 40px' : '180px 8% 60px',
    flexWrap: 'wrap',
    gap: isMobile ? '40px' : '60px'
  };

  const imageContainerStyle = {
    flex: 1,
    textAlign: isMobile ? 'center' : 'left',
    order: isMobile ? 2 : 1,
    minWidth: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? '100%' : '45%',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
    transition: 'all 0.8s ease-out'
  };

  const imageStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '650px',
    borderRadius: isMobile ? '20px' : '30px',
    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease',
    transform: 'scale(1)'
  };

  const imageHoverStyle = {
    ...imageStyle,
    transform: 'scale(1.02)'
  };

  const contentStyle = {
    flex: 1,
    textAlign: 'right',
    order: isMobile ? 1 : 2,
    minWidth: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? '100%' : '45%',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
    transition: 'all 0.8s ease-out 0.2s'
  };

  const headingStyle = {
    fontSize: isMobile ? '28px' : '42px',
    marginBottom: '20px',
    lineHeight: isMobile ? '1.4' : '1.2',
    animation: isVisible ? 'fadeInUp 0.8s ease-out 0.3s both' : 'none'
  };

  const spanStyle = {
    color: '#ffc107',
    display: 'inline-block',
    transition: 'transform 0.3s ease'
  };

  const paragraphStyle = {
    lineHeight: '2',
    marginBottom: '32px',
    color: '#555',
    fontSize: isMobile ? '15px' : '16px',
    animation: isVisible ? 'fadeInUp 0.8s ease-out 0.5s both' : 'none'
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: isMobile ? '14px 32px' : '16px 44px',
    backgroundColor: isButtonHovered ? '#e0a800' : '#ffc107',
    color: 'black',
    borderRadius: '30px',
    fontWeight: 'bold',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '14px' : '16px',
    transform: isButtonHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
    boxShadow: isButtonHovered ? '0 10px 25px rgba(255, 193, 7, 0.4)' : '0 5px 15px rgba(255, 193, 7, 0.2)',
    animation: isVisible ? 'fadeInUp 0.8s ease-out 0.7s both' : 'none'
  };

  return (
    <>
      <style>{heroStyles}</style>
      <section id="hero" style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692" 
            alt="Hero" 
            width={650} 
            height={400}
            style={isImageHovered ? imageHoverStyle : imageStyle}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          />
        </div>
        <div style={contentStyle}>
          <h1 style={headingStyle}>
            نطور <span style={spanStyle}>حلول برمجية</span> مبتكرة
          </h1>
          <p style={paragraphStyle}>
            نقدم خدمات رقمية متكاملة لتطوير الشركات والمؤسسات بأعلى جودة واحترافية.
          </p>
          <a 
            href="#contact" 
            style={buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            ابدأ مشروعك الآن
          </a>
        </div>
      </section>
    </>
  );
}
