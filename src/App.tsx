import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import BlogArticlePage from './pages/BlogArticlePage';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] selection:bg-[#00F5FF]/20 selection:text-[#00F5FF] relative overflow-x-hidden">
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

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </div>
    </div>
  );
}
