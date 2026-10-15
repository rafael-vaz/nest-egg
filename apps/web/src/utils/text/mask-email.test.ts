import { describe, expect, it } from "vitest";

import maskEmail from "./mask-email";

describe("maskEmail", () => {
  it("keeps the first two characters of the local part and masks the rest", () => {
    expect(maskEmail("felipe@gmail.com")).toBe("fe****@gmail.com");
  });

  it("keeps the full domain untouched", () => {
    expect(maskEmail("rafael.vaz@live.com")).toBe("ra********@live.com");
  });

  it("returns the local part unmasked when it has two characters or fewer", () => {
    expect(maskEmail("ab@gmail.com")).toBe("ab@gmail.com");
    expect(maskEmail("a@gmail.com")).toBe("a@gmail.com");
  });

  it("returns an empty string when given an empty string", () => {
    expect(maskEmail("")).toBe("");
  });

  it("returns the original value when there is no @ symbol", () => {
    expect(maskEmail("not-an-email")).toBe("not-an-email");
  });
});
