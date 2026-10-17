import {VideoScene} from "../components/VideoScene";
import {FPS, SCENES} from "../constants";
import {
  CLIP_LENGTHS_SECONDS,
  derivePlaybackRate,
  PADDED_DURATIONS,
  START_FROM_SECONDS,
} from "../timing";

const CAPTION = SCENES.find((s) => s.id === "goals")!.caption;
const START_FROM = START_FROM_SECONDS.goals;
const PLAYBACK_RATE = derivePlaybackRate(
  CLIP_LENGTHS_SECONDS.goals,
  START_FROM,
  PADDED_DURATIONS.goals,
  FPS,
);

export const Scene05Goals: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-05-goals.webm"
      caption={CAPTION}
      startFromSeconds={START_FROM}
      playbackRate={PLAYBACK_RATE}
    />
  );
};
