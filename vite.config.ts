import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Aktifkan service worker di dev mode
      },
      srcDir: 'src',
      filename: 'service-worker.ts',
      strategies: 'injectManifest', // Gunakan custom service worker
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Cuaca Harian',
        short_name: 'Cuaca',
        description: 'Aplikasi cuaca modern untuk melihat cuaca saat ini dan prakiraan 5 hari',
        theme_color: '#106587',
        background_color: '#f5f7fa',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});