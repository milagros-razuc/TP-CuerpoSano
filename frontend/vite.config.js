import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Puerto de tu backend Express (ajusta si usas otro)
const BACKEND_PORT = 3080

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // puerto del frontend (opcional, por defecto es 5173)
    open: true, // abre el navegador automáticamente
    proxy: {
      // Cualquier petición que empiece con /api
      // se redirigirá a tu backend
      '/api': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true, // necesario para algunos servidores
        secure: false,      // permite HTTPS en localhost (opcional)
        // Si tu API tiene rutas como /api/health, /api/users, etc.
        // este proxy las manejará todas
      }
    }
  }
})