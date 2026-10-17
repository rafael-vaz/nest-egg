import {describe, expect, it} from "vitest";
import {CLOSING_TEXT} from "./Scene08Closing";

describe("closing copy", () => {
  it("assembles the closing caption and URL, both verbatim", () => {
    expect(CLOSING_TEXT).toContain(
      "nest-egg — sua vida financeira, organizada.",
    );
    expect(CLOSING_TEXT).toContain("nest-egg-ef466.web.app");
  });
});
