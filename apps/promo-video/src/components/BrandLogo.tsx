import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {COLORS} from "../constants";

interface IBrandLogoProps {
  durationInFrames: number;
}

export const BrandLogo: React.FC<IBrandLogoProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [0.9, 1], {
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(
    frame,
    [0, durationInFrames / 3],
    [0, 1],
    {extrapolateRight: "clamp"},
  );
  const gradientOpacity = interpolate(
    frame,
    [0, durationInFrames / 2],
    [0, 0.15],
    {extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.accentStart}, ${COLORS.accentEnd})`,
          opacity: gradientOpacity,
        }}
      />
      <Img
        src={staticFile("logo.svg")}
        style={{
          width: 220,
          transform: `scale(${scale})`,
          opacity: logoOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
