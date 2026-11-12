import { useEffect, useRef } from 'react';
import { ensureMermaid } from '../utils/mermaidClient';

interface HtmlArticleBodyProps {
  html: string;
}

export default function HtmlArticleBody({ html }: HtmlArticleBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = html;
    let cancelled = false;

    const renderDiagrams = async () => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>('.mermaid'));
      if (nodes.length === 0) return;

      const mermaid = await ensureMermaid();
      if (cancelled) return;

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
