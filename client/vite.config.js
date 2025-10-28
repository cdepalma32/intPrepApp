import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite dev server config with API proxy + alias
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',         // so "@/lib/http" etc. resolve
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Anything starting with /api goes to Express server on :5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
