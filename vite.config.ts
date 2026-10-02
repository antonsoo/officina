import { defineConfig } from "vite";
import { contentSecurityPolicy } from "./vite.csp";

// Served at https://antonsoo.github.io/officina/
export default defineConfig({
  base: "/officina/",
  plugins: [contentSecurityPolicy()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
