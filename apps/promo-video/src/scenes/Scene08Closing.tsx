import {AbsoluteFill} from "remotion";
import {BrandLogo} from "../components/BrandLogo";
import {getCaptionStyle} from "../components/Caption";
import {CLOSING_URL, COLORS, SCENES} from "../constants";

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
        {/* Two-line layout (headline + URL) doesn't fit Caption's
            single-line fixed box, so this reuses the tested
            getCaptionStyle function directly instead of hardcoding
            font/weight/color a second time. */}
        <div
          style={{
            ...getCaptionStyle("headline"),
            textAlign: "center",
            maxWidth: "70%",
            marginBottom: 16,
          }}
        >
          {CAPTION}
        </div>
        <div style={{...getCaptionStyle("support"), textAlign: "center"}}>
          {CLOSING_URL}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
