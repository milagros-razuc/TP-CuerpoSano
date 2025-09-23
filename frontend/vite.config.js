import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // Fuerza el puerto 5173
    host: true, // Acepta conexiones de la red local
    open: true  // Abre el navegador automáticamente (opcional)
  }
});