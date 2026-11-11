import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';

const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage'));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted text-lg">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-page text-ink selection:bg-accent/20 selection:text-ink relative overflow-x-hidden">
      <div className="relative z-10">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
