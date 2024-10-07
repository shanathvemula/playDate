import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "69.197.176.103", // e.g., '192.168.1.100'
    port: 5173, // e.g., 3000
    proxy: {
      "/api": {
        target: "http://69.197.176.103:8000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
