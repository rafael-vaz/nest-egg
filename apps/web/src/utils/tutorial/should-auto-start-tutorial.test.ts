import { describe, expect, it } from "vitest";

import { shouldAutoStartTutorial } from "./should-auto-start-tutorial";

describe("shouldAutoStartTutorial", () => {
  it("returns true when the user has never seen the tutorial", () => {
    expect(shouldAutoStartTutorial(undefined)).toBe(true);
    expect(shouldAutoStartTutorial(false)).toBe(true);
  });

  it("returns false when the user has already seen the tutorial", () => {
    expect(shouldAutoStartTutorial(true)).toBe(false);
  });
});
