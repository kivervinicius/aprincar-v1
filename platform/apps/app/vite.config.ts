import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      injectManifest: { globPatterns: ['**/*.{js,css,html,json,svg,png,webp,woff2}'] },
      manifest: {
        name: 'Aprincar',
        short_name: 'Aprincar',
        description: 'Aprender acontece brincando.',
        start_url: process.env.VITE_BASE_PATH ?? '/',
        scope: process.env.VITE_BASE_PATH ?? '/',
        display: 'standalone',
        background_color: '#F7F6F2',
        theme_color: '#6F5BD7',
        categories: ['education', 'games'],
        icons: [
          {
            src: `${process.env.VITE_BASE_PATH ?? '/'}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: `${process.env.VITE_BASE_PATH ?? '/'}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
