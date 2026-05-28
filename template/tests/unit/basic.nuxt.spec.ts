import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import App from "../fixtures/basic/app.vue";

describe("verify basic fixture test (useful as an example, update for your app)", () => {
  it("renders the index page", async () => {
    expect.assertions(1);

    const wrapper = await mountSuspended(App);
    expect(wrapper.html()).toContain("<div>basic</div>");
  });
});
