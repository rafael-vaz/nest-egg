import {AbsoluteFill} from "remotion";
import {BrandLogo} from "../components/BrandLogo";
import {COLORS, FONTS, SCENES} from "../constants";

const DURATION = SCENES.find((s) => s.id === "opening")!.durationInFrames;
const CAPTION = SCENES.find((s) => s.id === "opening")!.caption;

export const Scene01Opening: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bgDark}}>
      <BrandLogo durationInFrames={DURATION} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "12%",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.textPrimary,
            textAlign: "center",
            maxWidth: "70%",
          }}
        >
          {CAPTION}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
