import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://eugenio-tesio-porfolio.web.app').replace(/\/$/, '');

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-site-url',
        transformIndexHtml(html: string) {
          return html.replaceAll('%SITE_URL%', SITE_URL);
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Mermaid diagram packs + react-pdf stay large but load only on demand.
      chunkSizeWarningLimit: 1300,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            // Keep mermaid out of manualChunks so its diagram types stay lazy.
            if (id.includes('@react-pdf')) return 'react-pdf';
            if (id.includes('highlight.js') || id.includes('rehype-highlight')) {
              return 'highlight';
            }
            if (
              id.includes('react-markdown') ||
              id.includes('remark-gfm') ||
              id.includes('/remark-') ||
              id.includes('/rehype-') ||
              id.includes('/unified/') ||
              id.includes('/mdast-') ||
              id.includes('/hast-')
            ) {
              return 'markdown';
            }
            if (id.includes('/motion/')) return 'motion';
            if (id.includes('i18next')) return 'i18n';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react-router')) return 'router';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
