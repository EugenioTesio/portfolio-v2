import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';

interface BlogPageHeaderProps {
  leading?: ReactNode;
}

export default function BlogPageHeader({ leading }: BlogPageHeaderProps) {
  return (
    <header className="border-b border-line bg-page/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {leading}
          <Link
            to="/"
            className="font-semibold text-xl tracking-tight text-ink hover:text-accent transition-colors"
          >
            Eugenio Tesio
          </Link>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}
