import {COLORS, FONTS} from "../constants";

export type CaptionVariant = "headline" | "support";

export function getCaptionStyle(
  variant: CaptionVariant,
): React.CSSProperties {
  if (variant === "headline") {
    return {
      fontFamily: FONTS.title,
      color: COLORS.textPrimary,
      fontSize: 48,
      fontWeight: 700,
    };
  }

  return {
    fontFamily: FONTS.content,
    color: COLORS.textSecondary,
    fontSize: 32,
    fontWeight: 400,
  };
}

interface ICaptionProps {
  text: string;
  variant: CaptionVariant;
}

export const Caption: React.FC<ICaptionProps> = ({text, variant}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "8%",
        left: "8%",
        right: "8%",
        textAlign: "center",
        ...getCaptionStyle(variant),
      }}
    >
      {text}
    </div>
  );
};
