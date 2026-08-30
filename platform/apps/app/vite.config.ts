import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const basePath = (process.env.VITE_BASE_PATH ?? '/').replace(/\/?$/, '/');

export default defineConfig({
  base: basePath,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return undefined;
          if (id.includes('/@mantine/')) return 'vendor-mantine';
          if (id.includes('/@tanstack/')) return 'vendor-router';
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
          if (id.includes('/dexie/')) return 'vendor-storage';
          if (id.includes('/lucide-react/')) return 'vendor-icons';
          return undefined;
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,webp,woff2}'],
        globIgnores: ['extensions/**'],
      },
      manifest: {
        name: 'Aprincar',
        short_name: 'Aprincar',
        description: 'Aprender acontece brincando.',
        start_url: basePath,
        scope: basePath,
        display: 'standalone',
        background_color: '#F7F6F2',
        theme_color: '#6F5BD7',
        categories: ['education', 'games'],
        icons: [
          {
            src: `${basePath}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: `${basePath}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
