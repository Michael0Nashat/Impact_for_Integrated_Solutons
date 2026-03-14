import { useEffect, useState } from 'react';

const aboutStyles = `
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

export default function About() {
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

    const section = document.getElementById('about');
    if (section) observer.observe(section);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const sectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile ? '30px' : '60px',
    marginTop: isMobile ? '50px' : '80px',
    flexWrap: 'wrap',
    padding: isMobile ? '0 5%' : '0 8%'
  };

  const textContainerStyle = {
    textAlign: 'right',
    flex: 1,
    minWidth: isMobile ? '100%' : 'auto',
    order: isMobile ? 2 : 1,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
    transition: 'all 0.8s ease-out'
  };

  const headingStyle = {
    fontSize: isMobile ? '28px' : '36px',
    marginBottom: '20px',
    animation: isVisible ? 'fadeInRight 0.8s ease-out' : 'none'
  };

  const paragraphStyle = {
    lineHeight: '2',
    color: '#555',
    fontSize: isMobile ? '15px' : '17px',
    animation: isVisible ? 'fadeInRight 0.8s ease-out 0.2s both' : 'none'
  };

  const imageContainerStyle = {
    flex: 1,
    textAlign: isMobile ? 'center' : 'left',
    minWidth: isMobile ? '100%' : 'auto',
    order: isMobile ? 1 : 2,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-50px) scale(0.95)',
    transition: 'all 0.8s ease-out 0.3s'
  };

  const imageStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '550px',
    borderRadius: isMobile ? '20px' : '30px',
    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  return (
    <>
      <style>{aboutStyles}</style>
      <section id="about" style={sectionStyle}>
        <div style={textContainerStyle}>
          <h2 style={headingStyle}>من نحن</h2>
          <p style={paragraphStyle}>
            تأسست شركة امباكت سنة 2023 بخبرة كبيرة في مجال التيار الخفيف و تأسيس المواقع و التطبيقات و معرفة قوية بالسوق أكتر من 13 سنة، وكمان معانا شهادات من براندات عالمية. هدفنا إننا نساعد العملاء في كل مراحل المشروع من أول التصميم لحد التنفيذ، وبإمكانياتنا بنقدّم كل طاقتنا علشان نوصل لأعلى جودة ونكون دايمًا سند ودعم لعملائنا. نظام أمان تقدر تعتمد عليه 24/7 راقب منشئتك بكل سهولة و انت مطمن من اي مكان باحدث الاجهزة و التكنولوجيا الموجودة في العالم
          </p>
        </div>
        <div style={imageContainerStyle}>
          <img 
            src="https://images.unsplash.com/photo-1509395176047-4a66953fd231" 
            alt="About" 
            width={550} 
            height={400}
            style={imageStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 50px 120px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 40px 100px rgba(0, 0, 0, 0.15)';
            }}
          />
        </div>
      </section>
    </>
  );
}
