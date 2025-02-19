import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['a111-2409-40d1-1a-8b98-880b-ca8b-c4ef-90d9.ngrok-free.app'],
  },
})
