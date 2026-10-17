import {IScene, SCENES} from "./constants";

// TransitionSeries overlaps each Transition's duration between the two
// sequences it borders, shrinking the series' total length below the sum
// of its sequences' durationInFrames. Every scene except the opening is
// padded by TRANSITION_DURATION frames — donated to the transition on its
// left — so the 7 transitions' total overlap is exactly offset by the
// extra frames distributed across scenes 2-8, keeping the series' actual
// rendered length equal to TOTAL_DURATION_IN_FRAMES.
export const TRANSITION_DURATION = 15;

export function getPaddedDuration(scene: IScene, index: number): number {
  return scene.durationInFrames + (index === 0 ? 0 : TRANSITION_DURATION);
}

export const PADDED_DURATIONS: Record<string, number> = Object.fromEntries(
  SCENES.map((scene, index) => [scene.id, getPaddedDuration(scene, index)]),
);

/**
 * The playback rate needed so that a clip, started at `startFromSeconds`
 * into its source, finishes playing exactly as `paddedDurationInFrames`
 * (the scene's actual on-screen duration, padding included) elapses —
 * instead of running past the end of the source and freezing on its last
 * frame.
 */
export function derivePlaybackRate(
  clipLengthSeconds: number,
  startFromSeconds: number,
  paddedDurationInFrames: number,
  fps: number,
): number {
  const remainingClipSeconds = clipLengthSeconds - startFromSeconds;
  const paddedDurationSeconds = paddedDurationInFrames / fps;
  return remainingClipSeconds / paddedDurationSeconds;
}

// Measured via `ffprobe -show_entries format=duration` against the
// recorded clips in public/clips/.
export const CLIP_LENGTHS_SECONDS: Record<string, number> = {
  transaction: 128.3,
  goals: 50.0,
  resources: 109.5,
  profile: 63.3,
};

// Starting point into each source clip (skips the login flash and idle
// dashboard time at the start of each recording) — see the plan's
// starting-value table.
export const START_FROM_SECONDS: Record<string, number> = {
  transaction: 18,
  goals: 5,
  resources: 8,
  profile: 6,
};
