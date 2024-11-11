import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7052', // API sunucunuzun adresi
        changeOrigin: true,
        secure: false, // HTTPS kullanıyorsanız ve self-signed sertifikalar varsa gerekli olabilir
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
