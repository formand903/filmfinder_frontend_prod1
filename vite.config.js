import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // важно: корень проекта
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
