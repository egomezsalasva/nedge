import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: "./setupTest.ts",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
