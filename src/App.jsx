import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedShapes from './components/AnimatedShapes';
import DashboardPage from './dashboard/DashboardPage';
import ProjectDetail from './components/ProjectDetail';

function Home() {
  return (
    <>
      <AnimatedShapes />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Partners />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
    </Routes>
  );
}
