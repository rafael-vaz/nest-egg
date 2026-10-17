import {describe, expect, it} from "vitest";
import {secondsToFrames} from "./VideoScene";

describe("secondsToFrames", () => {
  it("converts 2 seconds at 30fps to 60 frames", () => {
    expect(secondsToFrames(2, 30)).toBe(60);
  });

  it("converts 0 seconds to 0 frames", () => {
    expect(secondsToFrames(0, 30)).toBe(0);
  });

  it("converts fractional seconds correctly", () => {
    expect(secondsToFrames(1.5, 30)).toBe(45);
  });
});
