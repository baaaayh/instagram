import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), svgr()],
    server: {
        host: "0.0.0.0",
        allowedHosts: ["baaaayh.sytes.net"],
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
    },
});
