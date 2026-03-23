import { useState, useEffect } from 'react';

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const footerStyle = {
    background: '#f8f8f8',
    color: '#222',
    padding: isMobile ? '40px 5%' : '60px 8%',
    marginTop: isMobile ? '60px' : '100px',
    borderTop: '1px solid #e0e0e0'
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: isMobile ? '30px' : '40px'
  };

  const headingStyle = {
    marginBottom: '16px',
    fontSize: isMobile ? '18px' : '20px'
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  };

  const getLinkStyle = (index) => ({
    color: hoveredLink === index ? '#e0a800' : '#555',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    fontSize: isMobile ? '14px' : '16px'
  });

  const appLinksStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const socialLinks = [
    { href: '#', text: 'Facebook' },
    { href: '#', text: 'LinkedIn' }
  ];

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div>
          <h4 style={headingStyle}>تابعنا</h4>
          <div style={socialLinksStyle}>
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href}
                style={getLinkStyle(index)}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={headingStyle}>حمل التطبيق</h4>
          <div style={appLinksStyle}>
            <img 
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
              alt="App Store" 
              width={isMobile ? 120 : 140} 
              height={isMobile ? 35 : 40}
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
              alt="Google Play" 
              width={isMobile ? 120 : 140} 
              height={isMobile ? 35 : 40}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
