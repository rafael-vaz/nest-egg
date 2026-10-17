import {VideoScene} from "../components/VideoScene";
import {FPS, SCENES} from "../constants";
import {
  CLIP_LENGTHS_SECONDS,
  derivePlaybackRate,
  PADDED_DURATIONS,
  START_FROM_SECONDS,
} from "../timing";

const CAPTION = SCENES.find((s) => s.id === "resources")!.caption;
const START_FROM = START_FROM_SECONDS.resources;
const PLAYBACK_RATE = derivePlaybackRate(
  CLIP_LENGTHS_SECONDS.resources,
  START_FROM,
  PADDED_DURATIONS.resources,
  FPS,
);

export const Scene06Resources: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-06-resources.webm"
      caption={CAPTION}
      startFromSeconds={START_FROM}
      playbackRate={PLAYBACK_RATE}
    />
  );
};
