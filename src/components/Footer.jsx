import { useState, useEffect } from 'react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';

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
    background: 'rgba(15, 23, 42, 0.95)',
    color: '#cbd5e0',
    padding: isMobile ? '20px 5%' : '30px 8%',
    marginTop: isMobile ? '30px' : '60px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: isMobile ? '30px' : '40px'
  };

  const headingStyle = {
    marginBottom: '12px',
    fontSize: isMobile ? '16px' : '18px',
    color: '#f8fafc',
    textAlign: 'center'
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const getLinkStyle = (index) => ({
    color: hoveredLink === index ? '#ffc107' : '#94a3b8',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '20px' : '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const appLinksStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    flexWrap: 'wrap'
  };

  const socialLinks = [
    { href: '#', icon: <FaFacebook />, label: 'Facebook' },
    { href: '#', icon: <FaLinkedin />, label: 'LinkedIn' }
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
                aria-label={link.label}
              >
                {link.icon}
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
              width={isMobile ? 100 : 120}
              height={isMobile ? 30 : 35}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              width={isMobile ? 100 : 120}
              height={isMobile ? 30 : 35}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
