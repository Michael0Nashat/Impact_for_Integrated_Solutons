import { useState, useEffect } from 'react';

const contactStyles = `
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

export default function Contact() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

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
    }, { threshold: 0.1 });

    const section = document.getElementById('contact');
    if (section) {
      observer.observe(section);
      // fallback: if already in view on load
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight) setIsVisible(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('تم إرسال رسالتك بنجاح!');
  };

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

  const containerStyle = {
    background: 'white',
    padding: isMobile ? '30px 20px' : '70px',
    borderRadius: isMobile ? '25px' : '40px',
    boxShadow: '0 50px 120px rgba(0, 0, 0, 0.1)',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '30px' : '60px',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s ease-out 0.2s'
  };

  const getInfoStyle = (delay) => ({
    marginBottom: '16px',
    fontSize: isMobile ? '15px' : '16px',
    opacity: isVisible ? 1 : 0,
    animation: isVisible ? `fadeInLeft 0.6s ease-out ${delay}s both` : 'none'
  });

  const getInputStyle = (name) => ({
    width: '100%',
    padding: isMobile ? '14px' : '16px',
    marginBottom: '20px',
    borderRadius: '15px',
    border: focusedInput === name ? '2px solid #ffc107' : '1px solid #ddd',
    fontSize: isMobile ? '15px' : '16px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    transform: focusedInput === name ? 'scale(1.02)' : 'scale(1)',
    boxShadow: focusedInput === name ? '0 5px 15px rgba(255, 193, 7, 0.2)' : 'none'
  });

  const buttonStyle = {
    width: '100%',
    padding: isMobile ? '14px' : '16px',
    background: isButtonHovered ? '#e0a800' : '#ffc107',
    border: 'none',
    fontWeight: 800,
    borderRadius: '40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '15px' : '16px',
    transform: isButtonHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isButtonHovered ? '0 10px 25px rgba(255, 193, 7, 0.4)' : '0 5px 15px rgba(255, 193, 7, 0.2)'
  };

  return (
    <>
      <style>{contactStyles}</style>
      <section id="contact" style={sectionStyle}>
        <h2 style={headingStyle}>اتصل بنا</h2>
        <div style={containerStyle}>
          <div>
            <p style={getInfoStyle(0.4)}>📍 1 مصطفى رفعت, شيراتون</p>
            <p style={getInfoStyle(0.5)}>📞 <a href="tel:01027742000" style={{ color: 'inherit', textDecoration: 'none' }}>01027742000</a></p>
            <p style={getInfoStyle(0.5)}>📞 <a href="tel:01278370467" style={{ color: 'inherit', textDecoration: 'none' }}>01278370467</a></p>
            <p style={getInfoStyle(0.6)}>📧 <a href="mailto:mina.elwahsh@iisolutions.com.eg" style={{ color: 'inherit', textDecoration: 'none' }}>mina.elwahsh@iisolutions.com.eg</a></p>
            <p style={getInfoStyle(0.6)}>📧 <a href="mailto:k.mohsen@iisolutions.com.eg" style={{ color: 'inherit', textDecoration: 'none' }}>k.mohsen@iisolutions.com.eg</a></p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="الاسم"
              style={getInputStyle('name')}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              required
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              style={getInputStyle('email')}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              required
            />
            <textarea
              rows="5"
              placeholder="رسالتك"
              style={getInputStyle('message')}
              onFocus={() => setFocusedInput('message')}
              onBlur={() => setFocusedInput(null)}
              required
            />
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              إرسال
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
