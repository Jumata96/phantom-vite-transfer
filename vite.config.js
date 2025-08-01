import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,  // Asegúrate de que las solicitudes CORS estén habilitadas
  },
})