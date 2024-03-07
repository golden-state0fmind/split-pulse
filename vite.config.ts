import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    react(),
    legacy()
  ],
  define: {
    'import.meta.env.VITE_PUBLIC_URL': JSON.stringify('https://split-pulse.vercel.app/public/example_image.png')
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
