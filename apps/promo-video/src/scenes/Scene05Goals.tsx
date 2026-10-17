import {VideoScene} from "../components/VideoScene";
import {SCENES} from "../constants";

const CAPTION = SCENES.find((s) => s.id === "goals")!.caption;

export const Scene05Goals: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-05-goals.webm"
      caption={CAPTION}
      startFromSeconds={5}
      playbackRate={4.5}
    />
  );
};
