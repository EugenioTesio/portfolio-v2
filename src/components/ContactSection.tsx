import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Clock,
  MapPin,
  Copy,
  Check,
  ShieldCheck,
  Linkedin,
  MessageCircle,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { usePortfolioData } from '../data/portfolio';

const channelAccent = {
  email: {
    icon: 'text-[#00F5FF]',
    border: 'border-[#00F5FF]/30 hover:border-[#00F5FF]/70',
    glow: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]',
    bg: 'bg-[#00F5FF]/10',
    gradient: 'from-[#00F5FF]/20 to-transparent',
    cta: 'text-[#00F5FF]',
  },
  linkedin: {
    icon: 'text-[#9D00FF]',
    border: 'border-[#9D00FF]/30 hover:border-[#9D00FF]/70',
    glow: 'hover:shadow-[0_0_30px_rgba(157,0,255,0.15)]',
    bg: 'bg-[#9D00FF]/10',
    gradient: 'from-[#9D00FF]/20 to-transparent',
    cta: 'text-[#9D00FF]',
  },
  whatsapp: {
    icon: 'text-emerald-400',
    border: 'border-emerald-400/30 hover:border-emerald-400/70',
    glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    bg: 'bg-emerald-400/10',
    gradient: 'from-emerald-400/20 to-transparent',
    cta: 'text-emerald-400',
  },
} as const;

export default function ContactSection() {
  const { t } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyDirectEmail = (e: React.MouseEvent) => {
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
    <section id="contact" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
            <Mail className="w-3.5 h-3.5" />
            <span className="font-bold tracking-[2px]">{t('contactSection.sectionBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('contactSection.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#FF00E5]">
              {t('contactSection.titleHighlight')}
            </span>
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
            {t('contactSection.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Ambient gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/5 via-transparent to-[#9D00FF]/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00F5FF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#9D00FF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-6 sm:p-8 space-y-8">
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {t('contactSection.directChannels')}
                  </h3>
                  <p className="text-sm text-[#A0A0A0]">
                    {t('contactSection.channelsIntro')}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#00F5FF]/30 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
                  <span className="text-[#00F5FF] font-bold">{t('contactSection.turnaroundSla')}</span>
                  <span className="text-[#A0A0A0] hidden sm:inline">· 24h</span>
                </div>
              </div>

              {/* Channel cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {channels.map((channel, index) => {
                  const accent = channelAccent[channel.id];
                  const Icon = channel.icon;
                  const isEmail = channel.id === 'email';
                  const cardClass = `group relative flex flex-col gap-4 p-5 rounded-2xl bg-black/30 border ${accent.border} ${accent.glow} transition-all duration-300 hover:-translate-y-0.5`;
                  const motionProps = {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.4, delay: index * 0.08 },
                  };

                  const cardBody = (
                    <>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                      <div className="relative flex items-start justify-between">
                        <div className={`w-11 h-11 rounded-xl ${accent.bg} border border-white/10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${accent.icon}`} />
                        </div>
                        {!isEmail && (
                          <ArrowUpRight className={`w-4 h-4 ${accent.cta} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
                        )}
                      </div>

                      <div className="relative space-y-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A0A0A0]">
                          {channel.label}
                        </span>
                        <p className="text-sm font-bold text-white truncate">
                          {channel.value}
                        </p>
                        {!isEmail && (
                          <span className={`text-xs font-mono font-bold ${accent.cta} opacity-70 group-hover:opacity-100 transition-opacity`}>
                            {channel.cta} →
                          </span>
                        )}
                      </div>

                      {isEmail && (
                        <div className="relative mt-auto flex gap-2">
                          <a
                            href={channel.href}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl ${accent.bg} border ${accent.border} text-xs font-mono font-bold ${accent.cta} transition-colors`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {channel.cta}
                          </a>
                          <button
                            id="copy-email-btn"
                            onClick={handleCopyDirectEmail}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#A0A0A0] hover:text-white transition-colors"
                            title={t('contactSection.copyEmail')}
                          >
                            {copiedEmail ? (
                              <Check className="w-4 h-4 text-[#00F5FF]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  );

                  if (isEmail) {
                    return (
                      <motion.div key={channel.id} {...motionProps} className={cardClass}>
                        {cardBody}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.a
                      key={channel.id}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...motionProps}
                      className={cardClass}
                    >
                      {cardBody}
                    </motion.a>
                  );
                })}
              </div>

              {/* Location & availability row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#9D00FF]/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#9D00FF]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A0A0A0]">
                      {t('contactSection.baseLocation')}
                    </span>
                    <p className="text-sm font-semibold text-white">{PERSONAL_INFO.location}</p>
                    <p className="text-xs text-[#A0A0A0] flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-[#00F5FF] flex-shrink-0" />
                      {t('contactSection.timezone')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#00F5FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A0A0A0]">
                      {t('contactSection.turnaroundSla')}
                    </span>
                    <p
                      className="text-xs text-[#A0A0A0] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: t('contactSection.turnaroundDesc') }}
                    />
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#A0A0A0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F5FF]" />
                <span>{t('contactSection.securityNote')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
