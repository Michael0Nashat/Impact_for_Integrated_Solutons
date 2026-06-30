import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const contactStyles = `
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

export default function Contact() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isPrivacyHovered, setIsPrivacyHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phones: [],
    emails: [],
  });

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (rect.top < window.innerHeight) setIsVisible(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://impact-for-integrated-solutons-serv.vercel.app/api/contacts");
        if (!response.ok) throw new Error('فشل في تحميل بيانات التواصل');
        const rows = await response.json();
        
        // البحث عن أول سجل يحتوي على عنوان
        const addressRow = rows.find(r => r.address && r.address.trim() !== '');
        
        setContactInfo({
          address: addressRow?.address || "",
          phones: rows
            .map(r => r.phone)
            .filter(phone => phone && phone.trim() !== ''),
          emails: rows
            .map(r => r.email)
            .filter(email => email && email.trim() !== '')
        });
      } catch (err) {
        console.error('خطأ في تحميل بيانات التواصل:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل بيانات التواصل');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const subject = `رسالة جديدة من ${name}`;
    const body = `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`;
    const recipients = contactInfo.emails.join(';'); // استخدام ; بدلاً من , (أفضل للـ mailto)
    const mailtoUrl = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    alert('تم فتح تطبيق البريد لإرسال رسالتك!');
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

  const privacyBtnStyle = {
    width: '100%',
    marginTop: '12px',
    padding: isMobile ? '12px' : '14px',
    background: 'transparent',
    border: '2px solid #ffc107',
    color: isPrivacyHovered ? '#0f172a' : '#ffc107',
    background: isPrivacyHovered ? '#ffc107' : 'transparent',
    fontWeight: 700,
    borderRadius: '40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '14px' : '15px'
  };

  // عرض رسالة التحميل
  if (loading) {
    return (
      <section id="contact" style={sectionStyle}>
        <div style={{
          textAlign: 'center',
          padding: '50px',
          fontSize: '18px',
          color: '#666'
        }}>
          جاري تحميل بيانات التواصل...
        </div>
      </section>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <section id="contact" style={sectionStyle}>
        <div style={{
          textAlign: 'center',
          padding: '50px',
          fontSize: '18px',
          color: '#e74c3c',
          background: '#fde8e8',
          borderRadius: '15px',
          margin: '20px 0'
        }}>
          ⚠️ {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 25px',
              background: '#ffc107',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{contactStyles}</style>
      <section id="contact" style={sectionStyle}>
        <h2 style={headingStyle}>اتصل بنا</h2>
        <div style={containerStyle}>
          <div>
            {contactInfo.address && (
              <p style={getInfoStyle(0.4)}>📍 {contactInfo.address}</p>
            )}
            {contactInfo.phones.map((phone, index) => (
              <p key={`phone-${index}`} style={getInfoStyle(0.5 + index * 0.1)}>
                📞 <a 
                  href={`tel:${phone.replace(/\s/g, '')}`} 
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {phone}
                </a>
              </p>
            ))}
            {contactInfo.emails.map((email, index) => (
              <p key={`email-${index}`} style={getInfoStyle(0.6 + index * 0.1)}>
                📧 <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
              </p>
            ))}
            <p
              style={{
                ...getInfoStyle(0.7),
                marginTop: '12px',
                fontSize: isMobile ? '13px' : '14px',
                color: '#000000ff',
                cursor: 'pointer',
                textDecoration: isPrivacyHovered ? 'underline' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => setIsPrivacyHovered(true)}
              onMouseLeave={() => setIsPrivacyHovered(false)}
              onClick={() => navigate('/privacy-policy')}
            >
              🔒 سياسة الخصوصية / Privacy Policy
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="الاسم"
              value={formData.name}
              onChange={handleChange}
              style={getInputStyle('name')}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              style={getInputStyle('email')}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              required
            />
            <textarea
              name="message"
              rows="5"
              placeholder="رسالتك"
              value={formData.message}
              onChange={handleChange}
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