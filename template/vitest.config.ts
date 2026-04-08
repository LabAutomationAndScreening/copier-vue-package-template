// @vitest-environment node

import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
    resolve: {
        alias: {
            "~": fileURLToPath(new URL("./src/runtime", import.meta.url)),
        },
    },
    test: {
        include: ["test/**/*.spec.ts", "test/**/*.test.ts"],
    },
});
