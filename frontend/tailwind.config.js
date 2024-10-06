/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  server: {
    host: '69.197.176.103',  // Allows external access from any IP (local network)
    port: 3000,        // Port number where the app will run
    open: true,
    proxy: {
      '/api': {
        // target: 'http://localhost:8000/',
        target: 'http://69.197.176.103:8000/',  // Example API proxy to another server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional path rewrite
      },
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

