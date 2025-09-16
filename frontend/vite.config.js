import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Default port for frontend
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server
        changeOrigin: true, // Adjusts the origin to match the target
        rewrite: (path) => path.replace(/^\/api/, '') // Removes /api prefix for backend
      }
    }
  }
});