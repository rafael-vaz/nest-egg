import {describe, expect, it} from "vitest";
import {
  CLIP_LENGTHS_SECONDS,
  derivePlaybackRate,
  getPaddedDuration,
  PADDED_DURATIONS,
  START_FROM_SECONDS,
  TRANSITION_DURATION,
} from "./timing";
import {FPS, SCENES, TOTAL_DURATION_IN_FRAMES} from "./constants";

describe("getPaddedDuration", () => {
  it("adds no padding to the first scene (opening)", () => {
    const opening = SCENES[0];
    expect(getPaddedDuration(opening, 0)).toBe(opening.durationInFrames);
  });

  it("adds TRANSITION_DURATION to every other scene", () => {
    const dashboard = SCENES[1];
    expect(getPaddedDuration(dashboard, 1)).toBe(
      dashboard.durationInFrames + TRANSITION_DURATION,
    );
  });
});

describe("PADDED_DURATIONS", () => {
  it("sums (minus the 7 transition overlaps) back to the total composition length", () => {
    const sum = Object.values(PADDED_DURATIONS).reduce((a, b) => a + b, 0);
    const transitionCount = SCENES.length - 1;
    expect(sum - transitionCount * TRANSITION_DURATION).toBe(
      TOTAL_DURATION_IN_FRAMES,
    );
  });
});

describe("derivePlaybackRate", () => {
  it("computes the rate needed to consume exactly the remaining clip over the padded duration", () => {
    // 10 seconds of clip remaining, played over 300 frames (10s @ 30fps)
    // should need a 1x rate.
    expect(derivePlaybackRate(20, 10, 300, 30)).toBeCloseTo(1, 10);
  });

  it("matches a hand-computed example", () => {
    // 110.3s remaining clip, played over 315 frames (10.5s @ 30fps).
    expect(derivePlaybackRate(128.3, 18, 315, 30)).toBeCloseTo(
      110.3 / 10.5,
      10,
    );
  });
});

describe("video scene trims stay within their source clip's length", () => {
  const videoSceneIds = ["transaction", "goals", "resources", "profile"] as const;

  it.each(videoSceneIds)("%s does not play past the end of its clip", (id) => {
    const startFrom = START_FROM_SECONDS[id];
    const clipLength = CLIP_LENGTHS_SECONDS[id];
    const paddedDuration = PADDED_DURATIONS[id];
    const rate = derivePlaybackRate(clipLength, startFrom, paddedDuration, FPS);

    const endMediaTime = startFrom + (paddedDuration / FPS) * rate;

    expect(endMediaTime).toBeLessThanOrEqual(clipLength + 0.001);
  });
});
