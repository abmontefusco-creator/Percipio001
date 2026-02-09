import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Monte002/', // <-- deve essere il nome esatto del repository
  plugins: [react()]
})
