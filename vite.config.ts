
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: Ensure process.cwd() is correctly typed for Node.js context.
      // Using a type assertion to `any` to bypass strict checks when `NodeJS.Process`
      // is not implicitly available or explicitly removed. This assumes the runtime
      // environment is indeed Node.js.
      '@': path.resolve((process as any).cwd(), './src'), // Map @/ to the src directory
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})