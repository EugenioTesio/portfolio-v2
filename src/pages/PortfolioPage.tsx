import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import ProjectsGallery from '../components/ProjectsGallery';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);

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
    <>
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main id="main-content">
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection onNavigate={handleNavigate} />
        <ExperienceSection
          selectedCapabilityId={selectedCapabilityId}
          onClearCapabilityFilter={handleClearCapabilityFilter}
          onNavigateToProjects={() => handleNavigate('projects')}
        />
        <ProjectsGallery />
        <BlogSection />
        <ContactSection />
      </main>

      <Footer onNavigate={handleNavigate} />
    </>
  );
}
