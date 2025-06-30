import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  base: "./",
  build: {
    outDir: "dist", // important
  },
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
