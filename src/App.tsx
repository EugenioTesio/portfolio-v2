import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsGallery from './components/ProjectsGallery';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);

  // Scrollspy to set active navbar link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'projects', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearCapabilityFilter = () => {
    setSelectedCapabilityId(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] selection:bg-[#00F5FF]/20 selection:text-[#00F5FF] relative overflow-x-hidden">
      {/* Immersive UI Ambient Background Glow Orbs */}
      <div
        id="glow-1"
        className="fixed top-[-10%] left-[8%] w-[500px] h-[500px] radial-glow-cyan pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        id="glow-2"
        className="fixed bottom-[-10%] right-[5%] w-[600px] h-[600px] radial-glow-purple pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        id="glow-3"
        className="fixed top-[45%] right-[-5%] w-[450px] h-[450px] radial-glow-magenta pointer-events-none z-0 opacity-60"
        aria-hidden="true"
      />

      {/* Content wrapper with z-index above ambient glow */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        {/* Main Content Sections */}
        <main id="main-content">
          {/* Hero Section */}
          <HeroSection onNavigate={handleNavigate} />

          {/* Section 1: About Me */}
          <AboutSection onNavigate={handleNavigate} />

          {/* Section 2: Experience Highlights */}
          <ExperienceSection
            selectedCapabilityId={selectedCapabilityId}
            onClearCapabilityFilter={handleClearCapabilityFilter}
            onNavigateToProjects={() => handleNavigate('projects')}
          />

          {/* Section 3: Projects Gallery with filter and detail pages */}
          <ProjectsGallery />

          {/* Section 4: Blog Section rendering local repository Markdown files */}
          <BlogSection />

          {/* Section 5: Contact Form with real-time validation & email notification integration */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
