import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bidpulse-real-time-pulse-of-competitive-99aa.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // Add this base configuration for proper routing
  base: '/',
  build: {
    outDir: 'dist',
    // This ensures the index.html is served for all routes
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
