import { useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, Clock, MapPin, Copy, Check, Linkedin, MessageCircle } from 'lucide-react';
import { usePortfolioData } from '../data/portfolio';

export default function ContactSection() {
  const { t } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyDirectEmail = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const channels = [
    {
      id: 'email' as const,
      label: t('contactSection.primaryEmail'),
      value: PERSONAL_INFO.email,
      cta: t('contactSection.emailCta'),
      href: `mailto:${PERSONAL_INFO.email}`,
      icon: Mail,
    },
    {
      id: 'linkedin' as const,
      label: t('contactSection.linkedin'),
      value: 'eugenio-tesio',
      cta: t('contactSection.linkedinCta'),
      href: PERSONAL_INFO.socialLinks.linkedin,
      icon: Linkedin,
    },
    {
      id: 'whatsapp' as const,
      label: t('contactSection.whatsapp'),
      value: '+54 9 3564 599945',
      cta: t('contactSection.whatsappCta'),
      href: PERSONAL_INFO.socialLinks.whatsapp,
      icon: MessageCircle,
    },
  ];

  return (
    <section id="contact" className="py-[5.5rem] border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-10 max-w-[65ch]">
          <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-snug">
            {t('contactSection.title')} {t('contactSection.titleHighlight')}
          </h2>
          <p className="text-xl leading-[1.6] text-muted">
            {t('contactSection.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            const isEmail = channel.id === 'email';
            const body = (
              <>
                <Icon className="w-5 h-5 text-faint" />
                <div className="space-y-1 min-w-0">
                  <p className="text-base text-faint">{channel.label}</p>
                  <p className="text-base text-ink break-all">{channel.value}</p>
                </div>
                <span className="text-lg font-medium text-accent">{channel.cta}</span>
              </>
            );
            const className = 'flex flex-col items-start gap-4 p-6 rounded-2xl bg-surface border border-line text-left';

            if (isEmail) {
              return (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className={className}
                >
                  <Icon className="w-5 h-5 text-faint" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-base text-faint">{channel.label}</p>
                    <p className="text-base text-ink break-all">{channel.value}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href={channel.href} className="text-lg font-medium text-accent">
                      {channel.cta}
                    </a>
                    <button
                      id="copy-email-btn"
                      onClick={handleCopyDirectEmail}
                      className="inline-flex items-center gap-1.5 text-base text-muted"
                      title={t('contactSection.copyEmail')}
                    >
                      {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedEmail ? t('contactSection.copied') : t('contactSection.copyEmail')}</span>
                    </button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.a
                key={channel.id}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={className}
              >
                {body}
              </motion.a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-6 text-lg text-muted">
          <p className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-faint" />
            <span>{PERSONAL_INFO.location}</span>
          </p>
          <p className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4 text-faint" />
            <span>{t('contactSection.timezone')}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
