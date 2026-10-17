import {AbsoluteFill} from "remotion";
import {BrandLogo} from "../components/BrandLogo";
import {Caption} from "../components/Caption";
import {COLORS, SCENES} from "../constants";

const DURATION = SCENES.find((s) => s.id === "opening")!.durationInFrames;
const CAPTION = SCENES.find((s) => s.id === "opening")!.caption;

export const Scene01Opening: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bgDark}}>
      <BrandLogo durationInFrames={DURATION} />
      <Caption text={CAPTION} variant="headline" />
    </AbsoluteFill>
  );
};
