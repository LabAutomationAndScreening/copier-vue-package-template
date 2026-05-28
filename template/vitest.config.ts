import { fileURLToPath } from "node:url";
import { defineVitestProject } from "@nuxt/test-utils/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      defineVitestProject({
        resolve: {
          alias: {
            "~": fileURLToPath(new URL("./src/runtime", import.meta.url)),
            // @nuxt/test-utils v4 has a Bun-only branch that imports bun:test; Vite
            // cannot bundle a Bun built-in, so we redirect it to an empty stub.
            // Upstream issue: https://github.com/nuxt/test-utils/issues/1490
            "bun:test": fileURLToPath(new URL("./tests/setup/bun-test-stub.ts", import.meta.url)),
          },
        },
        test: {
          name: "unit-nuxt",
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL("./tests/fixtures/nuxt-app", import.meta.url)),
            },
          },
          include: ["tests/unit/**/*.nuxt.spec.ts"],
        },
      }),
      {
        plugins: [vue()],
        test: {
          name: "unit-dom",
          environment: "happy-dom",
          include: ["tests/unit/**/*.dom.spec.ts"],
        },
      },
      {
        test: {
          name: "unit-node",
          environment: "node",
          include: ["tests/unit/**/*.spec.ts"],
          exclude: [...configDefaults.exclude, "**/*.nuxt.spec.ts", "**/*.dom.spec.ts"],
        },
      },
      {
        // Runs in browser mode and deliberately omits the Nuxt runtime environment:
        // renders raw SFCs through Nuxt UI's Vite plugin so Tailwind-generated styling
        // is real, which is what the visual-regression baselines depend on.
        //
        // VRT_DIST flips the "system under test" from source to the built package. In
        // dist mode the component is imported from ./dist/runtime and the styles come
        // from the published package entry (its `style` export +
        // shipped `@source`), so the screenshots — which are authored from source and
        // shared by both modes — also verify the build output and packaging. See the
        // test-vrt:dist script: it runs `prepack` and self-links the package into
        // node_modules so the bare import resolves exactly as it would in a consumer.
        // Other libraries you use may need to be added to the plugins list (e.g. `ui({dts:false})` from `@nuxt/ui`).
        plugins: [vue()],
        resolve: {
          alias: {
            "#system-under-test": fileURLToPath(
              new URL(process.env.VRT_DIST ? "./dist/runtime" : "./src/runtime", import.meta.url),
            ),
            "#system-under-test-styles": fileURLToPath(
              new URL(process.env.VRT_DIST ? "./tests/vrt/styles.dist.css" : "./tests/vrt/styles.css", import.meta.url),
            ),
          },
        },
        test: {
          name: "browser",
          include: ["tests/vrt/**/*.spec.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium", viewport: { width: 1280, height: 720 } }],
          },
        },
      },
    ],
    coverage: {
      provider: "istanbul",
      allowExternal: true,
      reporter: ["text", "json", "html"],
      reportsDirectory: ".coverage",
      thresholds: { 100: true },
      include: ["src/**/*.{ts,vue}"],
      exclude: [
        "**/src/module.ts",
        "**/src/runtime/plugin.ts",
        "**/src/runtime/plugins/**",
        "**/playground/**",
        "**/*.d.ts",
        "**/*.d.mts",
        "**/src/runtime/test-utils/**",
        "**/tests/fixtures/**",
      ],
    },
  },
});
