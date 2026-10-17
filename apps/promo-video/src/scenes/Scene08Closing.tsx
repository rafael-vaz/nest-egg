import {AbsoluteFill} from "remotion";
import {BrandLogo} from "../components/BrandLogo";
import {CLOSING_URL, COLORS, FONTS, SCENES} from "../constants";

const DURATION = SCENES.find((s) => s.id === "closing")!.durationInFrames;
const CAPTION = SCENES.find((s) => s.id === "closing")!.caption;

export const CLOSING_TEXT = `${CAPTION} ${CLOSING_URL}`;

export const Scene08Closing: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bgDark}}>
      <BrandLogo durationInFrames={DURATION} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "10%",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.textPrimary,
            textAlign: "center",
            maxWidth: "70%",
            marginBottom: 16,
          }}
        >
          {CAPTION}
        </div>
        <div
          style={{
            fontFamily: FONTS.content,
            fontSize: 28,
            color: COLORS.textSecondary,
            textAlign: "center",
          }}
        >
          {CLOSING_URL}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
