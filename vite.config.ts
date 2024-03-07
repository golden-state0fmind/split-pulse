import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        clientsClaim: true,
        skipWaiting: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Split Pulse',
        short_name: 'Split Pulse',
        description: 'Split Pulse makes splitting bills among friends effortless.',
        theme_color: '#7045ff',
        icons: [
          {
            src: "assets/icon/favicon.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
            purpose: "any"
          },
          {
            src: "assets/icon/android-chrome-192x192.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/icon/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
