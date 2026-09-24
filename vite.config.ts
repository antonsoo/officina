import { defineConfig } from "vite";

// Served at https://antonsoo.github.io/officina/
export default defineConfig({
  base: "/officina/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
