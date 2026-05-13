import { resolve } from "node:path";
import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

describe("verify basic fixture test (useful as an example, update for your app)", async () => {
  await setup({
    rootDir: resolve(__dirname, "fixtures/basic"),
  });

  it("renders the index page", async () => {
    expect.assertions(1);

    const html = await $fetch("/");
    expect(html).toContain("<div>basic</div>");
  });
});
