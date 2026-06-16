import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: ['VITE_', 'PUBLIC_'],
  plugins: [
    tanstackRouter({
      target: 'react',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
})
