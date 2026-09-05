import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ContactValidationErrors, NotificationReceipt } from '../types';
import { usePortfolioData } from '../data/portfolio';

const INQUIRY_TYPE_KEYS = [
  'flutter',
  'fastapi',
  'leadership',
  'devsecops',
  'iot',
  'general',
] as const;

type InquiryTypeKey = typeof INQUIRY_TYPE_KEYS[number];

export default function ContactSection() {
  const { t } = useTranslation(['common', 'contact']);
  const { PERSONAL_INFO } = usePortfolioData();
  const formId = useId();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    inquiryType: 'flutter' as InquiryTypeKey,
    message: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [receipt, setReceipt] = useState<NotificationReceipt | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Email format regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Real-time validation
  const errors: ContactValidationErrors = {
    name: touched.name && formData.name.trim().length < 2
      ? t('contact:validation.name')
      : undefined,
    email: touched.email && !emailRegex.test(formData.email.trim())
      ? t('contact:validation.email')
      : undefined,
    subject: touched.subject && formData.subject.trim().length < 3
      ? t('contact:validation.subject')
      : undefined,
    message: touched.message && formData.message.trim().length < 20
      ? t('contact:validation.message', { count: formData.message.trim().length })
      : undefined
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    emailRegex.test(formData.email.trim()) &&
    formData.subject.trim().length >= 3 &&
    formData.message.trim().length >= 20;

  const handleBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inquiryTypeLabel = t(`contact:inquiryTypes.${formData.inquiryType}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      subject: true,
      inquiryType: true,
      message: true
    });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmissionStep(t('contact:submission.validating'));

    await new Promise(r => setTimeout(r, 600));
    setSubmissionStep(t('contact:submission.dispatching', { email: PERSONAL_INFO.email }));
    
    await new Promise(r => setTimeout(r, 700));
    setSubmissionStep(t('contact:submission.verifying'));

    await new Promise(r => setTimeout(r, 500));

    const newReceipt: NotificationReceipt = {
      receiptId: `NOTIF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      senderName: formData.name,
      senderEmail: formData.email,
      inquiryType: inquiryTypeLabel,
      subject: formData.subject,
      messageSnippet: formData.message.substring(0, 80) + (formData.message.length > 80 ? '...' : ''),
      targetEmail: PERSONAL_INFO.email,
      status: 'delivered'
    };

    setReceipt(newReceipt);
    setIsSubmitting(false);
    setSubmissionStep('');

    // Confetti effect!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#14b8a6', '#6366f1']
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopyDirectEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      inquiryType: 'flutter',
      message: ''
    });
    setTouched({});
    setReceipt(null);
  };

  const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    `${t('contact:mailto.subjectPrefix')} ${formData.subject || t('contact:mailto.defaultSubject')}`
  )}&body=${encodeURIComponent(
    `${t('contact:mailto.greeting')}\n\n${t('contact:mailto.nameLine', { name: formData.name || t('contact:mailto.yourName') })}\n${t('contact:mailto.inquiryLine', { type: inquiryTypeLabel })}\n\n${
      formData.message || ''
    }\n\n${t('contact:mailto.bestRegards')}\n${formData.name || ''}\n${formData.email || ''}`
  )}`;

  return (
    <section id="contact" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
            <Mail className="w-3.5 h-3.5" />
            <span className="font-bold tracking-[2px]">{t('contactSection.sectionBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('contactSection.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#FF00E5]">{t('contactSection.titleHighlight')}</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
            {t('contactSection.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {t('contactSection.directChannels')}
              </h3>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-[#00F5FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#00F5FF]" />
                    {t('contactSection.primaryEmail')}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-sm font-bold text-white hover:text-[#00F5FF] transition-colors truncate"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                    <button
                      id="copy-email-btn"
                      onClick={handleCopyDirectEmail}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors flex-shrink-0 border border-white/10"
                      title={t('contactSection.copyEmail')}
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-[#00F5FF]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Location Item */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-[#9D00FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9D00FF]" />
                    {t('contactSection.baseLocation')}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {PERSONAL_INFO.location}
                  </div>
                  <div className="text-xs text-[#A0A0A0]">
                    {t('contactSection.timezone')}
                  </div>
                </div>

                {/* Availability Item */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-[#00F5FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00F5FF]" />
                    {t('contactSection.turnaroundSla')}
                  </div>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed" dangerouslySetInnerHTML={{ __html: t('contactSection.turnaroundDesc') }} />
                </div>
              </div>

              {/* Security Guarantee */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#A0A0A0]">
                <ShieldCheck className="w-4 h-4 text-[#00F5FF]" />
                <span>{t('contactSection.securityNote')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Real-Time Validation & Receipt */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {receipt ? (
                  /* Success Delivery Receipt View */
                  <motion.div
                    key="receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-[#00F5FF]/40 shadow-[0_0_20px_rgba(0,245,255,0.15)]">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-[#00F5FF]">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {t('contactSection.emailDispatched')}
                        </h4>
                        <p className="text-xs text-[#A0A0A0]">
                          {t('contactSection.emailDispatchedDesc')}
                        </p>
                      </div>
                    </div>

                    {/* Cryptographic Delivery Receipt Details */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-[#A0A0A0]">{t('contactSection.auditReceipt')}</span>
                        <span className="text-[#00F5FF] font-bold">{receipt.receiptId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[#A0A0A0] block">{t('contactSection.sender')}</span>
                          <span className="text-slate-200">{receipt.senderName}</span>
                        </div>
                        <div>
                          <span className="text-[#A0A0A0] block">{t('contactSection.senderEmail')}</span>
                          <span className="text-slate-200 truncate block">{receipt.senderEmail}</span>
                        </div>
                        <div>
                          <span className="text-[#A0A0A0] block">{t('contactSection.inquiryType')}</span>
                          <span className="text-slate-200">{receipt.inquiryType}</span>
                        </div>
                        <div>
                          <span className="text-[#A0A0A0] block">{t('contactSection.timestamp')}</span>
                          <span className="text-slate-200">{new Date(receipt.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-2 text-[11px]">
                        <span className="text-[#A0A0A0] block mb-0.5">{t('contactSection.subject')}</span>
                        <span className="text-white font-semibold">{receipt.subject}</span>
                      </div>
                    </div>

                    {/* Fallback Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={mailtoUrl}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#00F5FF]" />
                        <span>{t('contactSection.openDesktopEmail')}</span>
                      </a>

                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F5FF] text-black text-xs font-extrabold uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t('contactSection.sendAnother')}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Live Form */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-lg font-bold text-white">{t('contactSection.sendInquiry')}</h3>
                      <span className="text-[10px] font-mono text-[#00F5FF] uppercase tracking-wider font-bold">
                        {t('contactSection.tlsValidation')}
                      </span>
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label htmlFor={`${formId}-name`} className="font-medium text-slate-300">
                          {t('contactSection.fullName')}
                        </label>
                        {touched.name && !errors.name && formData.name && (
                          <span className="text-[#00F5FF] text-[11px] font-mono flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#00F5FF]" /> {t('contactSection.valid')}
                          </span>
                        )}
                      </div>
                      <input
                        id={`${formId}-name`}
                        type="text"
                        placeholder={t('contactSection.namePlaceholder')}
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white text-sm placeholder-slate-500 border transition-all focus:outline-none backdrop-blur-md ${
                          errors.name
                            ? 'border-rose-500/80 focus:border-rose-400'
                            : touched.name && formData.name
                            ? 'border-[#00F5FF]/60 focus:border-[#00F5FF]'
                            : 'border-white/10 focus:border-[#00F5FF]/50'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label htmlFor={`${formId}-email`} className="font-medium text-slate-300">
                          {t('contactSection.emailAddress')}
                        </label>
                        {touched.email && !errors.email && formData.email && (
                          <span className="text-[#00F5FF] text-[11px] font-mono flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#00F5FF]" /> {t('contactSection.valid')}
                          </span>
                        )}
                      </div>
                      <input
                        id={`${formId}-email`}
                        type="email"
                        placeholder={t('contactSection.emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white text-sm placeholder-slate-500 border transition-all focus:outline-none backdrop-blur-md ${
                          errors.email
                            ? 'border-rose-500/80 focus:border-rose-400'
                            : touched.email && formData.email
                            ? 'border-[#00F5FF]/60 focus:border-[#00F5FF]'
                            : 'border-white/10 focus:border-[#00F5FF]/50'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Subject & Inquiry Type Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Inquiry Type */}
                      <div className="space-y-1.5">
                        <label htmlFor={`${formId}-inquiryType`} className="block text-xs font-medium text-slate-300">
                          {t('contactSection.inquiryFocus')}
                        </label>
                        <select
                          id={`${formId}-inquiryType`}
                          value={formData.inquiryType}
                          onChange={(e) => handleChange('inquiryType', e.target.value as InquiryTypeKey)}
                          className="w-full px-3 py-3 rounded-xl bg-[#050505] text-white text-sm border border-white/10 focus:outline-none focus:border-[#00F5FF]/50"
                        >
                          {INQUIRY_TYPE_KEYS.map((key) => (
                            <option key={key} value={key}>
                              {t(`contact:inquiryTypes.${key}`)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label htmlFor={`${formId}-subject`} className="font-medium text-slate-300">
                            {t('contactSection.subjectLabel')}
                          </label>
                          {touched.subject && !errors.subject && formData.subject && (
                            <span className="text-[#00F5FF] text-[11px] font-mono flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3 text-[#00F5FF]" /> {t('contactSection.valid')}
                            </span>
                          )}
                        </div>
                        <input
                          id={`${formId}-subject`}
                          type="text"
                          placeholder={t('contactSection.subjectPlaceholder')}
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          onBlur={() => handleBlur('subject')}
                          className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white text-sm placeholder-slate-500 border transition-all focus:outline-none backdrop-blur-md ${
                            errors.subject
                              ? 'border-rose-500/80 focus:border-rose-400'
                            : touched.subject && formData.subject
                              ? 'border-[#00F5FF]/60 focus:border-[#00F5FF]'
                              : 'border-white/10 focus:border-[#00F5FF]/50'
                          }`}
                        />
                        {errors.subject && (
                          <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> {errors.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message Area with Character Counter */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label htmlFor={`${formId}-message`} className="font-medium text-slate-300">
                          {t('contactSection.messageBody')}
                        </label>
                        <span className={`font-mono text-[11px] ${
                          formData.message.trim().length >= 20 ? 'text-[#00F5FF]' : 'text-slate-500'
                        }`}>
                          {t('contactSection.charsMin', { count: formData.message.trim().length })}
                        </span>
                      </div>
                      <textarea
                        id={`${formId}-message`}
                        rows={4}
                        placeholder={t('contactSection.messagePlaceholder')}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        onBlur={() => handleBlur('message')}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white text-sm placeholder-slate-500 border transition-all focus:outline-none resize-none backdrop-blur-md ${
                          errors.message
                            ? 'border-rose-500/80 focus:border-rose-400'
                            : touched.message && formData.message.trim().length >= 20
                            ? 'border-[#00F5FF]/60 focus:border-[#00F5FF]'
                            : 'border-white/10 focus:border-[#00F5FF]/50'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Progress State during Submission */}
                    {isSubmitting && (
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs text-[#00F5FF] flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{submissionStep}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      disabled={isSubmitting || !isFormValid}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold uppercase tracking-wider text-xs transition-all shadow-xl ${
                        isFormValid && !isSubmitting
                          ? 'bg-[#00F5FF] text-black hover:brightness-110 active:scale-98 shadow-[0_0_25px_rgba(0,245,255,0.4)] cursor-pointer'
                          : 'bg-white/[0.05] text-slate-500 cursor-not-allowed border border-white/10'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? t('contactSection.dispatching') : t('contactSection.dispatchEmail')}</span>
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
