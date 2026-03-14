import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedShapes from './components/AnimatedShapes';

export default function App() {
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
