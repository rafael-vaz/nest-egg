import {VideoScene} from "../components/VideoScene";
import {SCENES} from "../constants";

const CAPTION = SCENES.find((s) => s.id === "profile")!.caption;

export const Scene07Profile: React.FC = () => {
  return (
    <VideoScene
      src="clips/scene-07-profile.webm"
      caption={CAPTION}
      startFromSeconds={6}
      playbackRate={9.5}
    />
  );
};
