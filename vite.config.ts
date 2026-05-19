import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { openbouncerApi } from './vite-plugin-openbouncer'

export default defineConfig({
  plugins: [react(), tailwindcss(), openbouncerApi()],
})
