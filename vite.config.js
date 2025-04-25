import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public' // Cambia 'dist' a 'public'
  },
  test: {
    globals: true,
    //environment: 'jsdom', // ideal para apps React
    //setupFiles: './src/test/setup.js', // opcional, si necesitás configuraciones globales
  },
})
