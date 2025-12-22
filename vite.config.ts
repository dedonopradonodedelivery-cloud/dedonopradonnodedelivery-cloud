
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Map @/ to the src directory
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})