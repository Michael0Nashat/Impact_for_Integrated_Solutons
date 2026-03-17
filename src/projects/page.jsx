import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedShapes from '../components/AnimatedShapes';
import { API } from '../dashboard/useDashboardData';
import { allProjects as defaultProjects } from '../data/defaultProjects';

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then(r => r.json())
      .then(data => setAllProjects(Array.isArray(data) && data.length ? data : defaultProjects))
      .catch(() => setAllProjects(defaultProjects));

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionStyle = {
    padding: isMobile ? '100px 5% 50px' : '120px 8% 80px',
    minHeight: '100vh'
  };

  const containerStyle = {
    background: 'white',
    padding: isMobile ? '30px 20px' : '70px',
    borderRadius: isMobile ? '25px' : '40px',
    boxShadow: '0 50px 120px rgba(0, 0, 0, 0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: isMobile ? '25px' : '40px'
  };

  const getCardStyle = (index) => ({
    background: '#f9f9f9',
    borderRadius: isMobile ? '20px' : '25px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hoveredCard === index && !isMobile ? 'translateY(-15px)' : 'translateY(0)',
    boxShadow: hoveredCard === index ? '0 25px 70px rgba(0,0,0,0.15)' : '0 20px 60px rgba(0,0,0,0.08)',
    cursor: 'pointer'
  });

  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <section style={sectionStyle}>
        <h1 style={{ textAlign: 'center', fontSize: isMobile ? '32px' : '48px', marginBottom: isMobile ? '20px' : '30px', color: '#333' }}>
          جميع مشاريعنا
        </h1>
        <p style={{ textAlign: 'center', fontSize: isMobile ? '16px' : '18px', color: '#666', marginBottom: isMobile ? '40px' : '60px' }}>
          استعرض مجموعة من أعمالنا المتميزة في مجال التيار الخفيف
        </p>

        <div style={containerStyle}>
          <div style={gridStyle}>
            {allProjects.map((project, i) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', ...getCardStyle(i) }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={project.img}
                    alt={project.title}
                    width={400}
                    height={220}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      transform: hoveredCard === i ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '20px', color: '#333' }}>{project.title}</h3>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{project.description ?? project.desc ?? ''}</p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    padding: '6px 16px',
                    background: '#ffc107',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {project.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: isMobile ? '14px 32px' : '16px 44px',
              background: '#ffc107',
              color: 'black',
              borderRadius: '30px',
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
