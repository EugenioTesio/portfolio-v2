import type mermaidApi from 'mermaid';

type Mermaid = typeof mermaidApi;

let mermaidReady = false;
let mermaidModule: Mermaid | null = null;

async function loadMermaid(): Promise<Mermaid> {
  if (mermaidModule) return mermaidModule;
  const mod = await import('mermaid');
  mermaidModule = mod.default;
  return mermaidModule;
}

export async function ensureMermaid(): Promise<Mermaid> {
  const mermaid = await loadMermaid();
  if (mermaidReady) return mermaid;

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
      noteTextColor: '#16130f',
    },
  });
  mermaidReady = true;
  return mermaid;
}
