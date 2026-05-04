// @vitest-environment node
import { fileURLToPath } from "node:url";
import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

describe("verify basic fixture test (useful as an example, update for your app)", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
  });

  it("renders the index page", async () => {
    const html = await $fetch("/");
    expect(html).toContain("<div>basic</div>");
  });
});
