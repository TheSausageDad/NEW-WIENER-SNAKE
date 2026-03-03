import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [viteSingleFile()],
  base: '/NEW-WIENER-SNAKE/',
  build: {
    rollupOptions: {
      external: ['phaser'],
      output: {
        globals: {
          phaser: 'Phaser'
        }
      }
    }
  }
})
