import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'entry.ts',
      fileName: format => `index.${format === 'iife' ? 'min' : 'esm'}.js`,
      formats: ['es', 'iife'],
      name: 'Lib',
    },
    rollupOptions: { external: ['vue'], output: { globals: { vue: 'Vue' } } },
  },
  plugins: [vue(), dts()],
});
