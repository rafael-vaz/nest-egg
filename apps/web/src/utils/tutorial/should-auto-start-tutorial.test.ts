import { describe, expect, it } from "vitest";

import { shouldAutoStartTutorial } from "./should-auto-start-tutorial";

describe("shouldAutoStartTutorial", () => {
  it("returns true when the user has never seen the tutorial and the viewport is desktop-sized", () => {
    expect(shouldAutoStartTutorial(undefined, true)).toBe(true);
    expect(shouldAutoStartTutorial(false, true)).toBe(true);
  });

  it("returns false when the user has already seen the tutorial", () => {
    expect(shouldAutoStartTutorial(true, true)).toBe(false);
  });

  it("returns false on narrow viewports, even for a user who never saw it", () => {
    expect(shouldAutoStartTutorial(undefined, false)).toBe(false);
  });
});
