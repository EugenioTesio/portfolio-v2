import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

let mermaidReady = false;

function ensureMermaid(): void {
  if (mermaidReady) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    flowchart: { htmlLabels: false, curve: 'basis' },
    sequence: { actorMargin: 48, messageMargin: 36 },
    themeVariables: {
      darkMode: true,
      background: 'transparent',
      primaryColor: '#0d2a30',
      primaryTextColor: '#e2e8f0',
      primaryBorderColor: '#00F5FF',
      lineColor: '#67e8f9',
      secondaryColor: '#1a1030',
      tertiaryColor: '#111111',
      mainBkg: '#0d2a30',
      nodeBorder: '#00F5FF',
      clusterBkg: '#0a0a0a',
      clusterBorder: 'rgba(255,255,255,0.18)',
      titleColor: '#00F5FF',
      edgeLabelBackground: '#050505',
      actorBkg: '#0d2a30',
      actorBorder: '#00F5FF',
      actorTextColor: '#e2e8f0',
      signalColor: '#00F5FF',
      signalTextColor: '#e2e8f0',
      labelBoxBkgColor: '#0d2a30',
      labelTextColor: '#e2e8f0',
      noteBkgColor: '#1a1030',
      noteTextColor: '#e2e8f0'
    }
  });
  mermaidReady = true;
}

interface HtmlArticleBodyProps {
  html: string;
}

export default function HtmlArticleBody({ html }: HtmlArticleBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = html;
    ensureMermaid();

    const nodes = Array.from(el.querySelectorAll<HTMLElement>('.mermaid'));
    let cancelled = false;

    const renderDiagrams = async () => {
      for (const node of nodes) {
        if (cancelled) return;
        node.removeAttribute('data-processed');
        try {
          await mermaid.run({ nodes: [node] });
        } catch (error) {
          if (!cancelled) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Mermaid diagram failed to render', message);
          }
        }
      }
    };

    void renderDiagrams();
    return () => {
      cancelled = true;
    };
  }, [html]);

  return <div ref={containerRef} className="html-article markdown-body" />;
}
