import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  base: "/app/", // asset URLs become /app/assets/...
  build: {
    outDir: "../laravel-backend/public/app",
    emptyOutDir: true, // safe, because it only empties public/app
  },
})
