import { describe, expect, it } from "vitest";

import { shouldShowWelcomeModal } from "./should-show-welcome";

describe("shouldShowWelcomeModal", () => {
  it("returns true when the user has never seen the welcome modal", () => {
    expect(shouldShowWelcomeModal(undefined)).toBe(true);
    expect(shouldShowWelcomeModal(false)).toBe(true);
  });

  it("returns false when the user has already seen the welcome modal", () => {
    expect(shouldShowWelcomeModal(true)).toBe(false);
  });
});
