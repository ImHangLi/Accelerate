import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Add proxy configuration for API requests
  server: {
    proxy: {
      // Proxy requests to the Astra API
      "/astra-api": {
        target: "https://api.langflow.astra.datastax.com",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/astra-api/, ""),
        secure: true,
        headers: {
          Connection: "keep-alive",
        },
      },
    },
  },
})
