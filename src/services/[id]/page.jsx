import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedShapes from '../../components/AnimatedShapes';

const servicesData = {
  0: {
    icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006363.png',
    title: 'تطوير المواقع',
    desc: 'تصميم وبرمجة مواقع حديثة وسريعة للشركات.',
    details: [
      'تصميم واجهات مستخدم عصرية وجذابة',
      'برمجة مواقع بأحدث التقنيات مثل React وNext.js',
      'تحسين أداء المواقع وسرعة التحميل',
      'دعم كامل للأجهزة المحمولة والشاشات المختلفة',
      'تكامل مع قواعد البيانات وواجهات API',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
  },
  1: {
    icon: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
    title: 'تطبيقات الموبايل',
    desc: 'برمجة تطبيقات Android و iOS باحترافية.',
    details: [
      'تطوير تطبيقات Android و iOS بتقنية React Native',
      'واجهات مستخدم سلسة وسريعة الاستجابة',
      'تكامل مع الخدمات السحابية والإشعارات الفورية',
      'نشر التطبيقات على Google Play و App Store',
      'صيانة ودعم مستمر بعد الإطلاق',
    ],
    technologies: ['React Native', 'Flutter', 'Firebase', 'REST API'],
  },
  2: {
    icon: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png',
    title: 'أنظمة ERP',
    desc: 'أنظمة إدارة الشركات والمخازن والمبيعات.',
    details: [
      'إدارة المخزون والمستودعات',
      'نظام المبيعات والفواتير الإلكترونية',
      'إدارة الموارد البشرية والرواتب',
      'تقارير وإحصائيات تفصيلية',
      'تكامل مع الأنظمة المحاسبية',
    ],
    technologies: ['Odoo', 'SAP', 'Custom ERP', 'SQL Server'],
  },
  3: {
    icon: 'https://cdn-icons-png.flaticon.com/512/4248/4248443.png',
    title: 'التسويق الإلكتروني',
    desc: 'إدارة الحملات الإعلانية والسوشيال ميديا.',
    details: [
      'إدارة حسابات السوشيال ميديا',
      'إنشاء محتوى إبداعي وجذاب',
      'حملات إعلانية مدفوعة على Google و Meta',
      'تحسين محركات البحث SEO',
      'تقارير أداء دورية ومفصلة',
    ],
    technologies: ['Google Ads', 'Meta Ads', 'SEO', 'Content Marketing'],
  },
  4: {
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png',
    title: 'تصميم UI/UX',
    desc: 'تصميم واجهات احترافية سهلة الاستخدام.',
    details: [
      'تصميم تجربة المستخدم UX من الصفر',
      'نماذج أولية تفاعلية Prototyping',
      'اختبار قابلية الاستخدام مع المستخدمين الحقيقيين',
      'تصميم أنظمة بصرية متكاملة Design System',
      'تسليم ملفات جاهزة للتطوير',
    ],
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'Zeplin'],
  },
  5: {
    icon: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png',
    title: 'تحليل البيانات',
    desc: 'تحليل بيانات الشركات واتخاذ قرارات ذكية.',
    details: [
      'جمع وتنظيف البيانات من مصادر متعددة',
      'تحليل إحصائي متقدم',
      'لوحات معلومات تفاعلية Dashboards',
      'نماذج تنبؤية بالذكاء الاصطناعي',
      'تقارير قابلة للتخصيص',
    ],
    technologies: ['Python', 'Power BI', 'Tableau', 'Machine Learning'],
  },
};

export default function ServiceDetail() {
  const { id } = useParams();
  const service = servicesData[id];

  if (!service) {
    return (
      <>
        <AnimatedShapes />
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px', direction: 'rtl' }}>
          <h2>الخدمة غير موجودة</h2>
          <Link to="/#services" style={{ color: '#6366f1' }}>العودة للخدمات</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <div style={{ direction: 'rtl', padding: '80px 8% 60px', maxWidth: '900px', margin: '0 auto' }}>
        <Link
          to="/#services"
          style={{ color: '#6366f1', textDecoration: 'none', fontSize: '16px', display: 'inline-block', marginBottom: '32px' }}
        >
          ← العودة للخدمات
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img src={service.icon} alt={service.title} width={100} height={100} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>{service.title}</h1>
          <p style={{ color: '#555', fontSize: '18px' }}>{service.desc}</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>ما نقدمه</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {service.details.map((item, i) => (
              <li key={i} style={{ padding: '10px 0', borderBottom: i < service.details.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#6366f1', fontSize: '18px' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>التقنيات المستخدمة</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {service.technologies.map((tech, i) => (
              <span key={i} style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '50px',
                fontSize: '14px'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
