import { useState, useEffect } from 'react';

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navStyle = {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    padding: isMobile ? '8px 5%' : '5px 8%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
    flexWrap: 'wrap',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    minHeight: isMobile ? '60px' : '70px',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    height: isMobile ? '44px' : '60px',
    flexShrink: 0,
  };

  const menuButtonStyle = {
    display: isMobile ? 'block' : 'none',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px'
  };

  const ulStyle = {
    listStyle: 'none',
    display: isMobile ? (menuOpen ? 'flex' : 'none') : 'flex',
    gap: isMobile ? '15px' : '24px',
    flexDirection: isMobile ? 'column' : 'row',
    width: isMobile ? '100%' : 'auto',
    marginTop: isMobile ? '10px' : '0',
    padding: isMobile ? '10px 0' : '0'
  };

  const getLinkStyle = (index) => ({
    color: hoveredIndex === index ? '#ffc107' : '#ffffff',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.3s ease',
    fontSize: isMobile ? '14px' : '15px',
    display: 'block',
    padding: isMobile ? '5px 0' : '0'
  });

  const links = [
    { href: '/', text: 'الرئيسية', isHome: true },
    { href: '#about', text: 'من نحن' },
    { href: '#services', text: 'مجالات العمل' },
    { href: '#projects', text: 'مشاريعنا' },
    { href: '#partners', text: 'شركاؤنا' },
    { href: '#contact', text: 'اتصل بنا' }
  ];

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <img 
          src="/IMG-20260323-WA0015-removebg-preview.png" 
          alt="Impact Logo" 
          style={{ 
            height: '100%', 
            width: 'auto',
            objectFit: 'contain'
          }} 
        />
      </div>
      <button 
        style={menuButtonStyle}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <ul style={ulStyle}>
        {links.map((link, index) => (
          <li key={index}>
            {link.isHome ? (
              <a 
                href={link.href}
                style={getLinkStyle(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => isMobile && setMenuOpen(false)}
              >
                {link.text}
              </a>
            ) : (
              <a 
                href={link.href}
                style={getLinkStyle(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => isMobile && setMenuOpen(false)}
              >
                {link.text}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
