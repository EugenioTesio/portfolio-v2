import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Download } from 'lucide-react';
import { usePortfolioData } from '../data/portfolio';
import regeneratedProfileImage from '../assets/images/regenerated_image_1788456283242.jpg';
import { downloadCv } from '../utils/downloadCv';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t, i18n } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);
  const [profileImg, setProfileImg] = useState<string>(() => {
    return localStorage.getItem('eugenio_profile_img') || regeneratedProfileImage;
  });

  const handleDownloadCv = async () => {
    if (isGeneratingCv) return;
    setIsGeneratingCv(true);
    try {
      await downloadCv(i18n.language);
    } finally {
      setIsGeneratingCv(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('eugenio_profile_img');
    if (!stored || stored === '/profile-image-2.png' || stored === '/eugenio-tesio.jpg') {
      localStorage.setItem('eugenio_profile_img', regeneratedProfileImage);
      setProfileImg(regeneratedProfileImage);
    }

    const handleAvatarUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setProfileImg(customEvent.detail);
      } else {
        const storedItem = localStorage.getItem('eugenio_profile_img');
        if (storedItem) setProfileImg(storedItem);
      }
    };
    window.addEventListener('eugenio-avatar-update', handleAvatarUpdate);
    return () => window.removeEventListener('eugenio-avatar-update', handleAvatarUpdate);
  }, []);

  const metrics = [
    { value: t('hero.metricYears'), label: t('hero.metricYearsLabel') },
    { value: t('hero.metricEngineers'), label: t('hero.metricEngineersLabel') },
    { value: t('hero.metricReleaseTrain'), label: t('hero.metricReleaseTrainLabel') },
  ];

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 flex flex-col justify-center bg-transparent"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-accent">
                <span>{t('hero.eyebrow')}</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {PERSONAL_INFO.location}
                </span>
              </p>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-ink leading-[1.05]">
                {t('hero.headlineName')}
              </h1>

              <div className="space-y-3 max-w-[65ch]">
                <p className="text-2xl leading-[1.45] text-ink">
                  {t('hero.overviewP1')}
                </p>
                <p className="text-2xl leading-[1.45] text-muted">
                  {t('hero.overviewP2')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                id="hero-explore-projects-btn"
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-page text-lg font-medium hover:brightness-110 transition-all"
              >
                <span>{t('hero.viewCaseStudies')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-download-cv-btn"
                type="button"
                onClick={handleDownloadCv}
                disabled={isGeneratingCv}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-surface border border-line text-ink text-lg font-medium hover:border-ink/30 transition-colors disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{t('hero.downloadCv')}</span>
              </button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-line max-w-xl"
            >
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-base text-faint">{metric.label}</dt>
                  <dd className="mt-1 text-2xl sm:text-4xl font-semibold text-accent tracking-tight leading-none whitespace-nowrap">{metric.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden rounded-2xl border-2 border-accent/70 bg-surface"
            >
              <img
                src={profileImg}
                alt={t('hero.profileAlt')}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (e.currentTarget.src.includes('profile-image-2')) {
                    e.currentTarget.src = '/eugenio-tesio-tech.jpg';
                  } else if (e.currentTarget.src.includes('eugenio-tesio-tech')) {
                    e.currentTarget.src = '/eugenio-tesio.jpg';
                  }
                }}
                className="w-full h-[420px] sm:h-[480px] object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
