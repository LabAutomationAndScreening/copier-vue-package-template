import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { coverageConfigDefaults } from "vitest/config";

export default defineVitestConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src/runtime", import.meta.url)),
    },
  },
  test: {
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL("./test/fixtures/basic", import.meta.url)),
      },
    },
    include: ["test/**/*.spec.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      reportsDirectory: ".coverage",
      thresholds: { 100: true },
      exclude: [
        "**/src/module.ts",
        "**/src/runtime/plugin.ts",
        "**/src/runtime/plugins/**",
        "**/playground/**",
        "**/*.d.ts",
        "**/*.d.mts",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
