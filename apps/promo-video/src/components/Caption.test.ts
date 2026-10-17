import {describe, expect, it} from "vitest";
import {getCaptionStyle} from "./Caption";
import {COLORS, FONTS} from "../constants";

describe("getCaptionStyle", () => {
  it("headline variant uses the title font and primary text color", () => {
    const style = getCaptionStyle("headline");
    expect(style.fontFamily).toContain(FONTS.title);
    expect(style.color).toBe(COLORS.textPrimary);
  });

  it("support variant uses the content font and secondary text color", () => {
    const style = getCaptionStyle("support");
    expect(style.fontFamily).toContain(FONTS.content);
    expect(style.color).toBe(COLORS.textSecondary);
  });

  it("neither variant uses bold (700) — spec avoids bold everywhere", () => {
    expect(getCaptionStyle("headline").fontWeight).not.toBe(700);
    expect(getCaptionStyle("support").fontWeight).not.toBe(700);
  });

  it("headline variant uses medium (500) weight for emphasis", () => {
    expect(getCaptionStyle("headline").fontWeight).toBe(500);
  });
});
