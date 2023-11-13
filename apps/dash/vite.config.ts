import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    port: 22280,
    proxy: {
      "/api": {
        target: "http://localhost:22281/",
      },
    },
  },
});
