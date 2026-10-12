import { describe, expect, it } from "vitest";

import parseCurrency from "./parse-currency";

describe("parseCurrency", () => {
  it("converts a formatted Brazilian currency string to centavos", () => {
    expect(parseCurrency("R$ 1.234,56")).toBe(123456);
  });

  it("converts a value with no thousands separator", () => {
    expect(parseCurrency("R$ 50,00")).toBe(5000);
  });

  it("converts a value with no currency symbol or spaces", () => {
    expect(parseCurrency("10,00")).toBe(1000);
  });

  it("rounds fractional centavos", () => {
    expect(parseCurrency("R$ 10,999")).toBe(1100);
  });

  it("returns 0 for an empty string", () => {
    expect(parseCurrency("")).toBe(0);
  });

  it("returns 0 for a non-numeric string", () => {
    expect(parseCurrency("R$ abc")).toBe(0);
  });
});
