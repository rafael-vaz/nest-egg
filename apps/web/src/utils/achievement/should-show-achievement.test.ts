import { describe, expect, it } from "vitest";

import { shouldShowAchievementModal } from "./should-show-achievement";

describe("shouldShowAchievementModal", () => {
  it("returns true when progress has reached 100 and it was never seen", () => {
    expect(shouldShowAchievementModal(100, undefined)).toBe(true);
    expect(shouldShowAchievementModal(100, false)).toBe(true);
  });

  it("returns true when progress exceeds 100 and it was never seen", () => {
    expect(shouldShowAchievementModal(120, undefined)).toBe(true);
  });

  it("returns false when progress is below 100", () => {
    expect(shouldShowAchievementModal(99, undefined)).toBe(false);
    expect(shouldShowAchievementModal(0, undefined)).toBe(false);
  });

  it("returns false when the achievement was already seen, even at 100%", () => {
    expect(shouldShowAchievementModal(100, true)).toBe(false);
  });
});
