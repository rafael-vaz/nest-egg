import {describe, expect, it} from "vitest";
import {assertWalletMatches} from "./assert-wallet-matches";

describe("assertWalletMatches", () => {
  it("throws when the actual wallet differs from the expected baseline", () => {
    expect(() => assertWalletMatches(400000, 425000)).toThrow();
  });

  it("does not throw when the wallet matches the expected baseline", () => {
    expect(() => assertWalletMatches(425000, 425000)).not.toThrow();
  });

  it("throws when the actual wallet is undefined", () => {
    expect(() => assertWalletMatches(undefined, 425000)).toThrow();
  });

  it("includes both values in the thrown message", () => {
    expect(() => assertWalletMatches(400000, 425000)).toThrow(
      /425000.*400000/,
    );
  });
});
