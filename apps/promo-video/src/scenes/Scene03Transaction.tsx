import {VideoScene} from "../components/VideoScene";
import {FPS, SCENES} from "../constants";
import {
  CLIP_LENGTHS_SECONDS,
  derivePlaybackRate,
  PADDED_DURATIONS,
  START_FROM_SECONDS,
} from "../timing";

const CAPTION = SCENES.find((s) => s.id === "transaction")!.caption;
const START_FROM = START_FROM_SECONDS.transaction;
const PLAYBACK_RATE = derivePlaybackRate(
  CLIP_LENGTHS_SECONDS.transaction,
  START_FROM,
  PADDED_DURATIONS.transaction,
  FPS,
);

export const Scene03Transaction: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-03-transaction.webm"
      caption={CAPTION}
      startFromSeconds={START_FROM}
      playbackRate={PLAYBACK_RATE}
    />
  );
};
