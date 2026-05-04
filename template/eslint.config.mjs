// @ts-check

import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import vitest from "eslint-plugin-vitest";

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
  },
  dirs: {
    src: ["./playground"],
  },
}).append(
  // your custom flat config here...
  {
    // Disallow <script lang="js"> in Vue files
    files: ["**/*.vue"],
    rules: {
      "vue/block-lang": [
        "error",
        {
          script: {
            lang: "ts",
          },
        },
      ],
    },
  },
  {
    // Disallow .js files in favor of typescript
    files: ["**/*.js"],
    ignores: [
      // add exceptions here if you must allow certain .js files
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message: "Use .ts instead of .js.",
        },
      ],
    },
  },
  // @ts-expect-error -- eslint-plugin-vitest types are incompatible with ESLint 9's Plugin interface; safe to ignore
  {
    files: ["**/*.{test,spec}.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      "vitest/no-focused-tests": ["error", { fixable: false }], // automatically fixing this could confuse the user
      "vitest/consistent-test-filename": ["error", { pattern: ".*\\.spec\\.ts$" }],
      "vitest/prefer-lowercase-title": "off", // no reason to force lowercase titles
      "vitest/consistent-test-it": "off", // consistency for this is overrated, let the dev choose what's most readable based on the test title
      "vitest/prefer-to-be-falsy": "off", // sometimes you want to check explicitly for false and not just falsy
      "vitest/prefer-to-be-truthy": "off", // sometimes you want to check explicitly for true and not just truthy
    },
  },
);
