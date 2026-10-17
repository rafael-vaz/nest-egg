import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Caption} from "../components/Caption";
import {COLORS, FONTS, SCENES} from "../constants";

const DURATION = SCENES.find((s) => s.id === "reconciliation")!
  .durationInFrames;
const CAPTION = SCENES.find((s) => s.id === "reconciliation")!.caption;
const TARGET_WALLET_CENTAVOS = 425000;

function formatCentavosAsBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const Scene04Reconciliation: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, DURATION], [1.3, 1.5]);
  const walletCentavos = Math.round(
    interpolate(frame, [0, DURATION / 2], [0, TARGET_WALLET_CENTAVOS], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("clips/scene-02-dashboard.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "15% 30%",
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{justifyContent: "center", alignItems: "center", top: "-20%"}}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 72,
            fontWeight: 500,
            color: COLORS.textPrimary,
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          {formatCentavosAsBRL(walletCentavos)}
        </div>
      </AbsoluteFill>
      <Caption text={CAPTION} variant="support" />
    </AbsoluteFill>
  );
};
