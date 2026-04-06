import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location]);

  const navStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    padding: isMobile ? '12px 5%' : '8px 8%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    minHeight: isMobile ? '70px' : '85px',
    transition: 'all 0.3s ease',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    height: isMobile ? '50px' : '65px',
    cursor: 'pointer',
    zIndex: 1001,
  };

  const menuButtonStyle = {
    display: isMobile ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '30px',
    height: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    zIndex: 1001,
  };

  const barStyle = {
    width: '100%',
    height: '3px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  };

  const ulStyle = {
    listStyle: 'none',
    display: 'flex',
    gap: isMobile ? '0' : '28px',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'center' : 'center',
    justifyContent: isMobile ? 'center' : 'flex-end',
    position: isMobile ? 'fixed' : 'static',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: isMobile ? '100vh' : 'auto',
    width: isMobile ? '100%' : 'auto',
    backgroundColor: isMobile ? 'rgba(15, 23, 42, 0.98)' : 'transparent',
    padding: isMobile ? '80px 0 0 0' : '0',
    margin: 0,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isMobile ? (menuOpen ? 'translateX(0)' : 'translateX(100%)') : 'none',
    opacity: isMobile ? (menuOpen ? 1 : 0) : 1,
    visibility: isMobile ? (menuOpen ? 'visible' : 'hidden') : 'visible',
    pointerEvents: isMobile ? (menuOpen ? 'auto' : 'none') : 'auto',
  };

  const getLinkStyle = (index) => ({
    color: hoveredIndex === index ? '#ffc107' : '#ffffff',
    textDecoration: 'none',
    fontWeight: 700,
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '20px' : '16px',
    display: 'block',
    padding: isMobile ? '15px 0' : '5px 0',
    position: 'relative',
    textAlign: 'center',
  });

  const links = [
    { href: '/', text: 'الرئيسية', isHome: true },
    { href: '/#about', text: 'من نحن' },
    { href: '/#services', text: 'مجالات العمل' },
    { href: '/#projects', text: 'مشاريعنا' },
    { href: '/#partners', text: 'شركاؤنا' },
    { href: '/#contact', text: 'اتصل بنا' }
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith('/#')) {
      const targetId = href.split('#')[1];
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setMenuOpen(false);
        }
      } else {
        // Let normal Link handle it, which will navigate to / and then the browser will handle hash
        setMenuOpen(false);
      }
    }
  };

  return (
    <nav style={navStyle} dir="rtl">
      <div style={logoStyle} onClick={() => navigate('/')}>
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
        aria-label="Toggle Menu"
      >
        <div style={{ ...barStyle, transform: menuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></div>
        <div style={{ ...barStyle, opacity: menuOpen ? 0 : 1 }}></div>
        <div style={{ ...barStyle, transform: menuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></div>
      </button>

      <ul style={ulStyle}>
        {links.map((link, index) => (
          <li key={index} style={{ width: isMobile ? '100%' : 'auto' }}>
            <Link 
              to={link.href}
              style={getLinkStyle(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.text}
              {!isMobile && (
                <span style={{
                  position: 'absolute',
                  bottom: -2,
                  right: 0,
                  width: hoveredIndex === index ? '100%' : '0%',
                  height: '2px',
                  backgroundColor: '#ffc107',
                  transition: 'width 0.3s ease'
                }}></span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

