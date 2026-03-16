import { useState, useEffect } from 'react';
import { allProjects } from '../data/defaultProjects';

const STORAGE_KEY = 'dash_projects';

function loadFromStorage() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : allProjects;
  } catch { return allProjects; }
}

const projectStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Projects() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [storedProjects, setStoredProjects] = useState(loadFromStorage);

  // sync when dashboard updates localStorage
  useEffect(() => {
    const onStorage = () => setStoredProjects(loadFromStorage());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const featured = storedProjects.slice(0, 3);
  const displayed = showAll ? storedProjects : featured;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 });

    const section = document.getElementById('projects');
    if (section) observer.observe(section);

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const sectionStyle = {
    padding: isMobile ? '0' : '0 8%',
    marginTop: isMobile ? '50px' : '80px',
    overflowX: 'hidden'
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: isMobile ? '26px' : '40px',
    marginBottom: isMobile ? '30px' : '60px',
    padding: isMobile ? '0 5%' : '0',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'all 0.6s ease-out'
  };

  const containerStyle = {
    background: 'white',
    padding: isMobile ? '20px 15px' : '70px',
    borderRadius: isMobile ? '20px' : '40px',
    margin: isMobile ? '0 5%' : '0',
    boxShadow: '0 50px 120px rgba(0, 0, 0, 0.1)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s ease-out 0.2s'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: isMobile ? '25px' : '40px'
  };

  const getCardStyle = (index) => ({
    background: '#f9f9f9',
    borderRadius: isMobile ? '20px' : '25px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hoveredCard === index && !isMobile ? 'translateY(-15px)' : 'translateY(0)',
    boxShadow: hoveredCard === index ? '0 25px 70px rgba(0, 0, 0, 0.15)' : '0 20px 60px rgba(0, 0, 0, 0.08)',
    opacity: isVisible ? 1 : 0,
    animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
  });

  const buttonStyle = {
    display: 'inline-block',
    padding: isMobile ? '14px 32px' : '16px 44px',
    background: isButtonHovered ? '#e0a800' : '#ffc107',
    color: 'black',
    borderRadius: '30px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: isButtonHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
    fontSize: isMobile ? '14px' : '16px',
    boxShadow: isButtonHovered ? '0 10px 25px rgba(255, 193, 7, 0.4)' : '0 5px 15px rgba(255, 193, 7, 0.2)'
  };

  return (
    <>
      <style>{projectStyles}</style>
      <section id="projects" style={sectionStyle}>
        <h2 style={headingStyle}>مشاريعنا</h2>
        <div style={containerStyle}>
          <div style={gridStyle}>
            {displayed.map((project, i) => (
              <div
                key={project.id ?? i}
                style={getCardStyle(i)}
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
                  <h3 style={{ marginBottom: '12px', transition: 'color 0.3s ease' }}>{project.title}</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>{project.desc}</p>
                  {project.category && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showAll && storedProjects.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '30px', padding: isMobile ? '0 5%' : '0' }}>
            <button
              style={buttonStyle}
              onClick={() => setShowAll(true)}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              المزيد
            </button>
          </div>
        )}
      </section>
    </>
  );
}
