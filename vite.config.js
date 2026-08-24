import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://doc-flow-backend-master.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'https://doc-flow-backend-master.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/wa_api': {
        target: 'https://doc-flow-backend-master.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wa_api/, ''),
      },
    },
  },
})

