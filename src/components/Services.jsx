import { useMemo } from 'react';

export default function Services() {
  const categories = useMemo(() => [
    {
      id: 'light-current',
      title: 'أنظمة التيار الخفيف',
      services: [
        { title: 'كاميرات مراقبة', subtitle: 'مراقبة كاملة من أي مكان في العالم وتتبع للحركة', color: 'blue', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800', tags: ['CCTV', 'Security', 'Monitoring', 'HD-Video', 'Detection', 'Night-Vision', 'App-Access', 'Storage', 'DVR/NVR', 'High-Zoom'] },
        { title: 'اكسس كنترول', subtitle: 'نظام سمارت لفتح الابواب ببصمة الوجه وخاصية ال NFC', color: 'red', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800', tags: ['Access', 'Smart', 'Biometric', 'Door-Lock', 'RFID', 'Remote', 'Logs', 'AI-Face', 'Notifications', 'Bank-Grade'] },
        { title: 'انذار الحريق', subtitle: 'تنبيه سريع وفوري لأي حريق وسرعة التخلص منه', color: 'green', img: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800', tags: ['Fire Alarm', 'Safety', 'Protection', 'Smoke-Det', 'Siren', 'Autocall', 'Fire-Ext', 'Building-Safe', 'Battery-Back', 'Wireless'] },
        { title: 'الصوتيات', subtitle: 'رفاهية وجودة عالية مع انظمة صوت مبتكرة ونقاء صوت عالي', color: 'yellow', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', tags: ['Audio', 'Sound', 'Hi-Fi', 'PA-System', 'Broadcasting', 'Office-Music', 'Bluetooth', 'Mixing', 'Quality', 'Installation'] },
        { title: 'انذار سرقة', subtitle: 'تأمين كامل للمباني عبر التواصل التلقائي بالمكالمات والرسائل', color: 'orange', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800', tags: ['Anti-Theft', 'Alarm', 'Intrusion', 'Autodial', 'Sensor', 'Windows', 'Reliable', 'Emergency', 'Support', 'GSM-Alert'] },
        { title: 'انتركم', subtitle: 'رؤية والتحدث وفتح الباب عن بعد من الموبايل بجودة عالية', color: 'brown', img: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', tags: ['Intercom', 'Smart-Home', 'Video-Call', 'Remote-Open', 'Snapshot', 'Clear-Voice', 'Wired/Wireless', 'Easy-Access', 'Multiple-Units', 'Secure'] },
        { title: 'سنترالات تليفون', subtitle: 'سهولة في توصيل المكالمات الداخلية للمكاتب والشركات', color: 'grey', img: 'https://images.unsplash.com/photo-1549923155-46624430f2c7?auto=format&fit=crop&q=80&w=800', tags: ['Telephony', 'VOIP', 'PABX', 'IP-Phone', 'Conference', 'Call-Forward', 'Business', 'Voicemail', 'Analytics', 'Setup'] },
        { title: 'دش مركزي', subtitle: 'توصيل القنوات لكل التلفزيونات بجودة عالية وتكلفة أقل', color: 'blue', img: 'https://images.unsplash.com/photo-1461151351821-79734f7b190f?auto=format&fit=crop&q=80&w=800', tags: ['Satellite', 'Cable TV', 'DVB', '4K-Support', 'Apartment-Link', 'Multi-Switch', 'Channels', 'Signal-Boost', 'Wiring', 'Smart-TV'] },
        { title: 'حواجز وبوابات وباركينج', subtitle: 'انظمة ذكية للجراجات والانتظار وتنظيم ركنات السيارات', color: 'red', img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800', tags: ['Parking', 'Gates', 'RFID', 'Barrier', 'Traffic', 'Auto-Entry', 'Payments', 'Plate-Reader', 'Commercial', 'Sliding-Gate'] },
        { title: 'كواشف المعادن', subtitle: 'كشف المعادن غير الظاهرة بدقة وكفاءة عالية جداً', color: 'green', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', tags: ['Metal-Det', 'Safety', 'Scanning', 'Security', 'Airport-Level', 'X-Ray', 'Public-Safe', 'High-Sensitivity', 'Handheld', 'Venue-Secure'] },
        { title: 'كابلات انترنت وفايبر', subtitle: 'توصيل وتشغيل الكابلات بجميع فئاتها لضمان أعلى سرعة', color: 'yellow', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800', tags: ['Network', 'Fiber', 'Cabling', 'Ethernet', 'Cat6/Cat7', 'Low-Latency', 'High-Speed', 'Infrastructure', 'Testing', 'Reliable'] },
        { title: 'اجهزة شبكات', subtitle: 'تنظيم الشبكة لضمان أداء ثابت وسرعة أعلى في نقل البيانات', color: 'orange', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800', tags: ['Networks', 'Hardware', 'IT', 'Routers', 'Switches', 'Firewall', 'Server', 'Performance', 'WiFi-6', 'Management'] },
      ]
    },
    {
      id: 'web-mobile',
      title: 'تصميم المواقع وتطبيقات الموبايل',
      services: [
        { title: 'تصميم الموبايل ابلكيشن', subtitle: 'تطبيقات توصلك للعميل بسرعة وبأعلى كفاءة ممكنة', color: 'blue', img: '/IMG-20260329-WA0017.jpg', tags: ['Mobile', 'UX/UI', 'Dev', 'iOS', 'Android', 'React-Native', 'Fast', 'Cloud', 'Analytics', 'In-App-Store'] },
        { title: 'تصميم المواقع', subtitle: 'مواقع مبهرة بتجربة استخدام سهلة جداً ومناسبة للشركات', color: 'red', img: '/IMG-20260329-WA0019.jpg', tags: ['Web', 'Resp', 'Modern', 'Design', 'Fast-Load', 'Custom', 'SEO-Friendly', 'Frame-Work', 'SSL', 'Portfolio'] },
        { title: 'مواقع تجارة إلكترونية', subtitle: 'PWA باستخدام WooCommerce مع واجهة React متطورة', color: 'green', img: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800', tags: ['E-comm', 'React', 'Shop', 'Payment', 'Inventory', 'Dashboard', 'Shipping', 'Mobile-First', 'High-Conv', 'Discounts'] },
        { title: 'تطوير المحتوى', subtitle: 'قصص جذابة للناس ومتوافقة مع محركات البحث', color: 'yellow', img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', tags: ['Copy', 'SEO', 'Strategy', 'Growth', 'Social', 'Blog', 'Newsletter', 'Creative', 'Research', 'Targeted'] },
        { title: 'تحسين محركات البحث (SEO)', subtitle: 'زوّد ظهورك على الإنترنت بخبرتنا الممتدة', color: 'orange', img: '/IMG-20260329-WA0018.jpg', tags: ['SEO', 'Rank', 'Opt', 'Google', 'Performance', 'Backlinks', 'Keywords', 'Reporting', 'Speed', 'Viral'] },
        { title: 'البريد الإلكتروني', subtitle: 'تواصل مع جمهورك من خلال حملات إيميل قوية وفعالة', color: 'brown', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800', tags: ['Email', 'Mark', 'Auto', 'Leads', 'Professional', 'Templates', 'Campaign', 'CTR-Opt', 'Routine', 'Anti-Spam'] },
        { title: 'الصيانة والدعم الفني', subtitle: 'خلّي شغلك ماشي بسلاسة من خلال خدماتنا الاحترافية', color: 'grey', img: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800', tags: ['Support', 'Maint', 'IT', 'Security', 'Backup', 'Update', 'Bug-Fix', 'Remote', '24/7', 'Service'] },
      ]
    },
    {
      id: 'digital-marketing',
      title: 'التسويق الإلكتروني',
      services: [
        {
          title: 'خليك دايمًا قدام المنافسين',
          color: 'blue',
          img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
          tags: ['Growth', 'Success', 'Leads', 'ROI', 'Strategy', 'Ads', 'Brain', 'Scale', 'Precis', 'Biz'],
          customDesc: 'زوّد مبيعاتك ووصل لجمهورك الصح بخطط تسويق مدروسة وحملات بتجيب نتيجة فعلًا. من أول الفكرة لحد النجاح، إحنا بنبني لك حضور قوي على الإنترنت يخلي عملاءك يختاروك. استهدف صح وكبّر شغلك، بنوصلك للعميل المناسب في الوقت المناسب.'
        },
      ]
    }
  ], []);

  return (
    <section id="services" style={{ padding: '80px 0', direction: 'rtl' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '2.8rem',
          fontWeight: '900',
          color: '#1a1a1a',
          position: 'relative',
          display: 'inline-block',
          marginBottom: '20px'
        }}>
          مجالات العمل
        </h2>
        <p style={{
          fontSize: '1.5rem',
          color: '#000000ff',
          maxWidth: '850px',
          margin: '20px auto 0',
          lineHeight: '1.8',
          fontWeight: '500',
          opacity: 0.95,
          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
        >
          نحن نقدم باقة متكاملة من الخدمات التقنية والأمنية بمواصفات عالمية
        </p>
      </div>
      {categories.map((category) => (
        <div key={category.id} className="category-section" style={{ marginBottom: '80px' }}>
          <h2 className="section-title">
            {category.title}
          </h2>

          {category.id === 'digital-marketing' ? (
            <div className="marketing-container">
              {category.services.map((service, idx) => (
                <div key={idx} className="marketing-card">
                  <div className="marketing-content">
                    <div className="marketing-tags">
                      {service.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="marketing-tag">{tag}</span>
                      ))}
                    </div>
                    <h3 className="marketing-title">{service.title}</h3>
                    <p className="marketing-desc">{service.customDesc}</p>
                  </div>
                  <div className="marketing-image">
                    <img src={service.img} alt={service.title} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {category.id === 'light-current' && (
                <div className="category-hero">
                  <img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200" alt={category.title} />
                  <div className="category-hero-overlay">
                    <div className="category-hero-title">{category.title}</div>
                    <div className="category-hero-subtitle">حلول أمنية وبنية تحتية متكاملة للمنشآت الحديثة</div>
                  </div>
                </div>
              )}

              <div className={category.id === 'light-current' ? 'compact-grid' : 'projcard-container'}>
                {category.services.map((service, idx) => (
                  category.id === 'light-current' ? (
                    <div
                      key={idx}
                      className="compact-card"
                      style={{
                        '--card-color': `var(--projcard-${service.color}-color, ${service.color === 'blue' ? '#0088FF' :
                          service.color === 'red' ? '#D62F1F' :
                            service.color === 'green' ? '#40BD00' :
                              service.color === 'yellow' ? '#F5AF41' :
                                service.color === 'orange' ? '#FF5722' :
                                  service.color === 'brown' ? '#C49863' : '#424242'
                          })`
                      }}
                    >
                      <div className="compact-title">{service.title}</div>
                      <div className="compact-subtitle">{service.subtitle}</div>
                      {service.tags && (
                        <div className="compact-tagbox">
                          {service.tags.slice(0, 7).map((tag, tIdx) => (
                            <span key={tIdx} className="compact-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className={`projcard projcard-${service.color}`}
                    >
                      <div className="projcard-innerbox">
                        <img className="projcard-img" src={service.img} alt={service.title} />
                        <div className="projcard-textbox">
                          <div className="projcard-title">{service.title}</div>
                          <div className="projcard-bar"></div>
                          <div className="projcard-description">
                            {service.customDesc || service.subtitle}
                          </div>
                          {service.customDesc && (
                            <div className="projcard-subtitle" style={{ marginTop: '10px' }}>{service.subtitle}</div>
                          )}
                          <div className="projcard-tagbox">
                            {service.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="projcard-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
