import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Much simpler configuration to avoid loading issues
  build: {
    outDir: 'dist',
  },
  // Ensure the entry point is properly recognized
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Only add optimizeDeps if you have specific dependencies to pre-bundle
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
