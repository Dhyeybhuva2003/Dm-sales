import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // if deploying to root domain
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'dist', // ✅ Netlify expects this
  },
});
