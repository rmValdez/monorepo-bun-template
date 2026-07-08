import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    rollupOptions: {
      external: ["@workspace/db", "@prisma/client", "@prisma/adapter-pg"],
    },
  },
  // TODO: remove this if the packages that have these issues get fixed upstream
  optimizeDeps: {
    include: [
      "@tanstack/react-form-start",
      "@tanstack/react-router",
      "@tanstack/react-store",
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/index.js",
      "use-sync-external-store/shim/with-selector.js",
      "use-sync-external-store/shim/with-selector",
    ],
    exclude: ["bun", "@base-ui/react"],
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), nitro({ preset: "bun" }), viteReact()],
});

export default config;
