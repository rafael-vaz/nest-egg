import {VideoScene} from "../components/VideoScene";
import {SCENES} from "../constants";

const CAPTION = SCENES.find((s) => s.id === "resources")!.caption;

export const Scene06Resources: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-06-resources.webm"
      caption={CAPTION}
      startFromSeconds={8}
      playbackRate={11.5}
    />
  );
};
