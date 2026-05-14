import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#cbd5e0',
    padding: '60px 8%',
    fontFamily: 'inherit'
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '50px',
    maxWidth: '900px',
    margin: '0 auto',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: 800,
    color: '#ffc107',
    textAlign: 'center',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: '40px',
    fontSize: '14px'
  };

  const sectionTitleStyle = {
    fontSize: '22px',
    fontWeight: 700,
    color: '#f8fafc',
    marginTop: '40px',
    marginBottom: '16px',
    borderBottom: '2px solid #ffc107',
    paddingBottom: '8px'
  };

  const listStyle = {
    paddingRight: '20px',
    lineHeight: '2',
    fontSize: '16px'
  };

  const contactLinkStyle = {
    color: '#ffc107',
    textDecoration: 'none'
  };

  const backBtnStyle = {
    display: 'block',
    margin: '40px auto 0',
    padding: '12px 36px',
    background: '#ffc107',
    border: 'none',
    borderRadius: '40px',
    fontWeight: 800,
    fontSize: '16px',
    cursor: 'pointer',
    color: '#0f172a'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Privacy Policy / سياسة الخصوصية</h1>
        <p style={subtitleStyle}>Last updated / آخر تحديث: 2026/5/14</p>

        {/* English */}
        <h2 style={sectionTitleStyle}>English</h2>
        <p>This Privacy Policy explains how we collect and use user information.</p>
        <ul style={listStyle}>
          <li>We may collect: name, phone number, address, and service details.</li>
          <li>We use data to provide services, process requests, and improve the service.</li>
          <li>We do not sell user data to any third parties.</li>
          <li>Data may be shared only with technicians.</li>
          <li>We use reasonable security measures to protect data.</li>
        </ul>

        {/* Arabic */}
        <h2 style={{ ...sectionTitleStyle, direction: 'rtl' }}>العربية</h2>
        <div dir="rtl">
          <p>تشرح هذه السياسة كيفية جمع واستخدام معلومات المستخدم.</p>
          <ul style={listStyle}>
            <li>قد نقوم بجمع: الاسم، رقم الهاتف، العنوان، وبيانات الطلبات.</li>
            <li>نستخدم البيانات لتقديم الخدمات ومعالجة الطلبات وتحسين الخدمة.</li>
            <li>لا نقوم ببيع بيانات المستخدمين لأي طرف ثالث.</li>
            <li>قد يتم مشاركة البيانات فقط مع الفنيين.</li>
            <li>نستخدم إجراءات حماية مناسبة لتأمين البيانات.</li>
          </ul>
        </div>

        {/* Contact */}
        <h2 style={sectionTitleStyle}>Contact / التواصل</h2>
        <p>
          📧 Email:{' '}
          <a href="mailto:k.mohsen@iisolutions.com.eg" style={contactLinkStyle}>k.mohsen@iisolutions.com.eg</a>
          {' | '}
          <a href="mailto:mina.elwahsh@iisolutions.com.eg" style={contactLinkStyle}>mina.elwahsh@iisolutions.com.eg</a>
        </p>
        <p>
          📞 Phone:{' '}
          <a href="tel:01278370467" style={contactLinkStyle}>01278370467</a>
          {' | '}
          <a href="tel:01027742000" style={contactLinkStyle}>01027742000</a>
        </p>

        <button style={backBtnStyle} onClick={() => navigate(-1)}>
          ← Back / رجوع
        </button>
      </div>
    </div>
  );
}
