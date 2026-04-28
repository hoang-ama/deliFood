import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Cho phép Vite chạy trên các domain đã khai báo trong file hosts
    host: '0.0.0.0', 
    // Nếu bạn muốn ép buộc mở đúng domain khi chạy npm run dev
    // open: 'http://local.delifood.com:5173'
  }
})