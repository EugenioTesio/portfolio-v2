import { getCvContent } from '../data/cv/content';

function resolveLocale(locale: string): 'en' | 'es' {
  return locale.startsWith('es') ? 'es' : 'en';
}

export async function downloadCv(locale: string): Promise<void> {
  const lang = resolveLocale(locale);
  const content = getCvContent(lang);
  const [{ pdf }, { default: CvDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../components/cv/CvDocument'),
  ]);
  const blob = await pdf(<CvDocument content={content} />).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Eugenio_Tesio_CV_${lang.toUpperCase()}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
