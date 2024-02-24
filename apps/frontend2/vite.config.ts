import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    port: 22279,
    proxy: {
      "/api": {
        target: "http://localhost:22281/",
      },
    },
  },
});
