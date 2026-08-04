import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3003,
    host: true,
    allowedHosts: ['dvviet-thin', 'localhost'],
    fs: {
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
