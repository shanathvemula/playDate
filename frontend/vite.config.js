import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // '157.173.195.249', //
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:8000/", // "http://157.173.195.249:8000/", //  
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
})
