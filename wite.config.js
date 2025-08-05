import { defineConfig } from 'wite'
import react from '@witejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'build',
  },
})

