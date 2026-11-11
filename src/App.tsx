import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogArticlePage from './pages/BlogArticlePage';

export default function App() {
  return (
    <div className="min-h-screen bg-page text-ink selection:bg-accent/20 selection:text-ink relative overflow-x-hidden">
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </div>
    </div>
  );
}
