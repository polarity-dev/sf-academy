import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from 'tailwindcss'

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  plugins: [tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  server: {
    open: true,
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },
  cacheDir: '.vite'
});
