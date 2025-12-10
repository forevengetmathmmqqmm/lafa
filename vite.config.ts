import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 设置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  css: {
    // 配置CSS预处理器
    preprocessorOptions: {
      scss: {
        // 可以在这里添加全局scss变量或混合器
        additionalData: '',
      },
    },
  },
  // 定义全局变量
  define: {
    'global': 'window'
  }
})
