import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable CSS minification to avoid the lightningcss native-binary
    // resolution issue on Vercel/Linux builds (the macOS-generated
    // package-lock omits the Linux binary). CSS is served unminified.
    cssMinify: false,
  },
})
