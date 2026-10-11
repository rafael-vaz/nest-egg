import { describe, expect, it } from "vitest";

import calculateGoalProgress from "./calculate-goal-progress";

describe("calculateGoalProgress", () => {
  it("returns the percentage of the goal's target value covered by the wallet", () => {
    expect(calculateGoalProgress(100_500, 350_000)).toBeCloseTo(28.71, 2);
  });

  it("caps progress at 100 when the wallet exceeds the goal's target value", () => {
    expect(calculateGoalProgress(500_000, 350_000)).toBe(100);
  });

  it("returns 0 when the wallet value is 0", () => {
    expect(calculateGoalProgress(0, 350_000)).toBe(0);
  });

  it("returns 0 when the goal's target value is 0", () => {
    expect(calculateGoalProgress(100, 0)).toBe(0);
  });
});
