import { describe, expect, it } from "vitest";

import checkInputCurrencyValue from "./check-input-currency-value";

describe("checkInputCurrencyValue", () => {
  it("delegates to parseCurrency for a valid value", () => {
    expect(checkInputCurrencyValue("R$ 1.234,56")).toBe(123456);
  });

  it("returns 0 for an unparseable value rather than throwing", () => {
    expect(checkInputCurrencyValue("R$ abc")).toBe(0);
  });
});
