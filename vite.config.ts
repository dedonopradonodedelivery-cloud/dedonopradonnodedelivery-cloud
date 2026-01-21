
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import fileURLToPath

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configure '@' alias to point to the project root (conceptual 'src/' folder)
      // FIX: Replace __dirname with import.meta.url and path.dirname for Vite compatibility.
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})