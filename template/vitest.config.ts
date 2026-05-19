import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { coverageConfigDefaults } from "vitest/config";

export default defineVitestConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src/runtime", import.meta.url)),
      // @nuxt/test-utils v4 has a Bun-only branch that imports bun:test; Vite
      // cannot bundle a Bun built-in, so we redirect it to an empty stub.
      // Upstream issue: https://github.com/nuxt/test-utils/issues/1490
      "bun:test": fileURLToPath(new URL("./test/setup/bun-test-stub.ts", import.meta.url)),
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
      allowExternal: true,
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
        "**/test/fixtures/**",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
