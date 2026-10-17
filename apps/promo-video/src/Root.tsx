import {Composition} from "remotion";
import {FPS, TOTAL_DURATION_IN_FRAMES} from "./constants";
import {PromoVideo} from "./PromoVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PromoVideoWide"
      component={PromoVideo}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
    />
  );
};
