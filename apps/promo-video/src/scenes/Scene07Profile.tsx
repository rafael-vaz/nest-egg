import {VideoScene} from "../components/VideoScene";
import {FPS, SCENES} from "../constants";
import {
  CLIP_LENGTHS_SECONDS,
  derivePlaybackRate,
  PADDED_DURATIONS,
  START_FROM_SECONDS,
} from "../timing";

const CAPTION = SCENES.find((s) => s.id === "profile")!.caption;
const START_FROM = START_FROM_SECONDS.profile;
const PLAYBACK_RATE = derivePlaybackRate(
  CLIP_LENGTHS_SECONDS.profile,
  START_FROM,
  PADDED_DURATIONS.profile,
  FPS,
);

export const Scene07Profile: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-07-profile.webm"
      caption={CAPTION}
      startFromSeconds={START_FROM}
      playbackRate={PLAYBACK_RATE}
    />
  );
};
