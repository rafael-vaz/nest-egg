import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Caption} from "../components/Caption";
import {SCENES} from "../constants";

const DURATION = SCENES.find((s) => s.id === "dashboard")!.durationInFrames;
const CAPTION = SCENES.find((s) => s.id === "dashboard")!.caption;

export const Scene02Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, DURATION], [1, 1.06]);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("clips/scene-02-dashboard.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Caption text={CAPTION} variant="support" />
    </AbsoluteFill>
  );
};
