import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../types';
import type { Locale } from '../data/portfolio';

export default function BlogDemo({ post, locale, standalone = false }: { post: BlogPost; locale: Locale; standalone?: boolean }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(standalone);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const frame = useRef<HTMLIFrameElement>(null);
  const demo = post.demo!;
  const src = `${demo.assetPath}?lng=${locale}`;
  useEffect(() => {
    if (!active) return;
    setStatus('loading');
    const receive = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'flutter-demo-ready') setStatus('ready');
    };
    window.addEventListener('message', receive);
    const timer = window.setTimeout(() => setStatus(s => s === 'ready' ? s : 'error'), 30000);
    return () => { window.removeEventListener('message', receive); clearTimeout(timer); };
  }, [active, attempt, locale]);
  return <section className="my-8 rounded-2xl border border-line overflow-hidden bg-surface" aria-label={demo.title}>
    <div className="p-5 space-y-3">
      <h2 className="text-2xl font-semibold">{demo.title}</h2>
      <p className="text-muted">{demo.description}</p>
      <div className="flex gap-4 flex-wrap text-accent">
        {!standalone && <Link to={`/blog/${post.slug}/demo?lng=${locale}`}>{t('demo.open')}</Link>}
        <a href={demo.sourceDownload} download>{t('demo.download')}</a>
      </div>
      <p className="text-sm text-muted">{t('demo.languageReset')}</p>
    </div>
    {!active ? <div className="relative">
      <img src={demo.previewImage} alt={demo.previewAlt} className="w-full max-h-80 object-cover object-top" loading="lazy" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/35"><button type="button" onClick={() => setActive(true)} className="bg-accent text-page rounded-xl px-6 py-3 font-semibold">{t('demo.run')}</button></div>
    </div> : <>
      {status !== 'ready' && <div className="p-5" role="status">
        <p>{t(status === 'error' ? 'demo.failed' : 'demo.loading')}</p>
        {status === 'error' && <button type="button" onClick={() => setAttempt(a => a + 1)} className="text-accent underline mt-2">{t('demo.retry')}</button>}
      </div>}
      <iframe ref={frame} key={`${locale}-${attempt}`} src={src} title={demo.title} className={`w-full border-0 ${standalone ? 'h-[85dvh] min-h-[650px]' : 'h-[780px]'}`} onError={() => setStatus('error')} />
      <p className="p-4 text-sm"><a className="text-accent underline" href={src} target="_blank" rel="noopener noreferrer">{t('demo.direct')}</a></p>
    </>}
  </section>;
}
