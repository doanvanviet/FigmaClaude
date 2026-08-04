import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    fs: {
      // Cho phép dev server serve file từ thư mục cha (D:\Figma)
      // → bao gồm cả mds-ui/src/fonts/*.woff2 — cần thiết để font Inter load đúng
      allow: [path.resolve(__dirname, '..')]
    }
  },
  resolve: {
    alias: {
      '@mds': path.resolve(__dirname, '../mds-ui/src'),
      '@tabler/icons-vue': path.resolve(__dirname, 'node_modules/@tabler/icons-vue/dist/esm/tabler-icons-vue.mjs'),
    }
  }
})
