import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  base: "/Personal-Resume/",
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    },
  },
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("index.html", import.meta.url)),
        compliance: fileURLToPath(
          new URL("projects/compliance/index.html", import.meta.url),
        ),
        "mock-interview": fileURLToPath(
          new URL("projects/mock-interview/index.html", import.meta.url),
        ),
        "career-pathfinder": fileURLToPath(
          new URL("projects/career-pathfinder/index.html", import.meta.url),
        ),
        "resume-autofill": fileURLToPath(
          new URL("projects/resume-autofill/index.html", import.meta.url),
        ),
      },
    },
  },
});
