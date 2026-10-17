import {VideoScene} from "../components/VideoScene";
import {SCENES} from "../constants";

const CAPTION = SCENES.find((s) => s.id === "transaction")!.caption;

export const Scene03Transaction: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-03-transaction.webm"
      caption={CAPTION}
      startFromSeconds={18}
      playbackRate={11}
    />
  );
};
