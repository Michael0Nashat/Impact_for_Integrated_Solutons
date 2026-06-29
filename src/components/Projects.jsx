import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../dashboard/useDashboardData';
import { allProjects } from '../data/defaultProjects';

const projectStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = () => {
      fetch(`${API}/projects`)
        .then(r => r.json())
        .then(data => setProjects(Array.isArray(data) && data.length ? data : allProjects))
        .catch(() => setProjects(allProjects));
    };

    loadProjects();
    window.addEventListener('projects-updated', loadProjects);

    // re-fetch every 5s to catch dashboard changes
    const interval = setInterval(loadProjects, 5000);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setIsVisible(true); }),
      { threshold: 0.1 }
    );
    const section = document.getElementById('projects');
    if (section) observer.observe(section);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('projects-updated', loadProjects);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const displayed = showAll ? projects : projects.slice(0, 6);

  const getCardStyle = (i) => ({
    background: '#f9f9f9', borderRadius: isMobile ? '20px' : '25px',
    overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hoveredCard === i && !isMobile ? 'translateY(-15px)' : 'translateY(0)',
    boxShadow: hoveredCard === i ? '0 25px 70px rgba(0,0,0,0.15)' : '0 20px 60px rgba(0,0,0,0.08)',
    opacity: isVisible ? 1 : 0,
    animation: isVisible ? `fadeInUp 0.6s ease-out ${i * 0.1}s both` : 'none',
  });

  const buttonStyle = {
    display: 'inline-block', padding: isMobile ? '14px 32px' : '16px 44px',
    background: isButtonHovered ? '#e0a800' : '#ffc107',
    color: 'black', borderRadius: '30px', fontWeight: 'bold',
    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
    transform: isButtonHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
    fontSize: isMobile ? '14px' : '16px',
    boxShadow: isButtonHovered ? '0 10px 25px rgba(255,193,7,0.4)' : '0 5px 15px rgba(255,193,7,0.2)',
  };

  // normalize: DB uses "description", defaults use "desc"
  const getDesc = (p) => p.description ?? p.desc ?? '';

  return (
    <>
      <style>{projectStyles}</style>
      <section id="projects" style={{ padding: isMobile ? '0' : '0 8%', marginTop: isMobile ? '50px' : '80px', overflowX: 'hidden' }}>
        <h2 style={{
          textAlign: 'center', fontSize: isMobile ? '26px' : '40px',
          marginBottom: isMobile ? '30px' : '60px', padding: isMobile ? '0 5%' : '0',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.6s ease-out',
        }}>مشاريعنا</h2>

        <div style={{
          background: 'white', padding: isMobile ? '20px 15px' : '70px',
          borderRadius: isMobile ? '20px' : '40px', margin: isMobile ? '0 5%' : '0',
          boxShadow: '0 50px 120px rgba(0,0,0,0.1)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out 0.2s',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? '25px' : '40px' }}>
            {displayed.map((project, i) => (
              <div
                key={project.id ?? i}
                style={{ ...getCardStyle(i), cursor: 'pointer' }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/projects/${project.id ?? i}`)}
              >
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={project.img} alt={project.title} width={400} height={220}
                    style={{
                      width: '100%', height: '220px', objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      transform: hoveredCard === i ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{project.title}</h3>
                  <p style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: isMobile ? '15px' : '16px',
                    color: '#222',
                    lineHeight: '1.7',
                  }}>
                    {getDesc(project)}
                  </p>
                  {project.category && (
                    <span style={{
                      display: 'inline-block', marginTop: '12px', padding: '6px 16px',
                      background: '#ffc107', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                    }}>
                      {project.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showAll && projects.length > 6 && (
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
