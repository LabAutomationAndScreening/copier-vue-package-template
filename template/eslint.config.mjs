// @ts-check

import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import vitest from "@vitest/eslint-plugin";

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
  { ignores: [".claude/**"] },
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
  {
    files: ["**/*.{test,spec}.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      "vitest/unbound-method": "off", // requires typed linting (parserOptions.project), not configured in this project
      "vitest/require-mock-type-parameters": "off", // stylistic; vi.fn() inferred type is sufficient and explicit generics add noise on trivial mocks
      "vitest/prefer-describe-function-title": "off", // autofix rewrites string titles to identifier references, which then conflicts with vitest/valid-title for default-imported functions
      "vitest/padding-around-all": "off", // project test style keeps blank lines minimal (see AGENTS.md); these rules pad every block boundary
      "vitest/padding-around-after-all-blocks": "off",
      "vitest/padding-around-after-each-blocks": "off",
      "vitest/padding-around-before-all-blocks": "off",
      "vitest/padding-around-before-each-blocks": "off",
      "vitest/padding-around-describe-blocks": "off",
      "vitest/padding-around-expect-groups": "off",
      "vitest/padding-around-test-blocks": "off",
      "vitest/no-focused-tests": ["error", { fixable: false }], // automatically fixing this could confuse the user
      "vitest/consistent-test-filename": ["error", { pattern: ".*\\.spec\\.ts$" }],
      "vitest/prefer-lowercase-title": "off", // no reason to force lowercase titles
      "vitest/consistent-test-it": "off", // consistency for this is overrated, let the dev choose what's most readable based on the test title
      "vitest/prefer-to-be-falsy": "off", // sometimes you want to check explicitly for false and not just falsy
      "vitest/prefer-to-be-truthy": "off", // sometimes you want to check explicitly for true and not just truthy
    },
  },
);
