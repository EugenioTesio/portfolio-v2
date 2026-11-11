import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

let mermaidReady = false;

function ensureMermaid(): void {
  if (mermaidReady) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'strict',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    flowchart: { htmlLabels: false, curve: 'basis' },
    sequence: { actorMargin: 48, messageMargin: 36 },
    themeVariables: {
      darkMode: false,
      background: 'transparent',
      primaryColor: '#fffdf8',
      primaryTextColor: '#16130f',
      primaryBorderColor: '#9a3412',
      lineColor: '#5c5348',
      secondaryColor: '#f6f1e7',
      tertiaryColor: '#efe8db',
      mainBkg: '#fffdf8',
      nodeBorder: '#9a3412',
      clusterBkg: '#f6f1e7',
      clusterBorder: 'rgba(22,19,15,0.16)',
      titleColor: '#16130f',
      edgeLabelBackground: '#fffdf8',
      actorBkg: '#fffdf8',
      actorBorder: '#9a3412',
      actorTextColor: '#16130f',
      signalColor: '#5c5348',
      signalTextColor: '#16130f',
      labelBoxBkgColor: '#fffdf8',
      labelTextColor: '#16130f',
      noteBkgColor: '#efe8db',
      noteTextColor: '#16130f'
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
