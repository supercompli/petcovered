
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If hosting in a subfolder (e.g., domain.com/petcovered/), change base to '/petcovered/'
  base: '/',
  resolve: {
    alias: {
      '@': '/',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'genai-vendor': ['@google/genai']
        },
      },
    },
  },
});
