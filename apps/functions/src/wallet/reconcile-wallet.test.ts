import {describe, expect, it} from "vitest";

import {computeWalletDelta} from "./reconcile-wallet";

describe("computeWalletDelta", () => {
  it("applies a new credit occurrence as a positive delta", () => {
    const result = computeWalletDelta(
      {},
      [{date: "2026-01-05", value: 100, type: "credit"}],
    );

    expect(result).toEqual({delta: 100, desired: {"2026-01-05": 100}});
  });

  it("applies a new debt occurrence as a negative delta", () => {
    const result = computeWalletDelta(
      {},
      [{date: "2026-01-05", value: 100, type: "debt"}],
    );

    expect(result).toEqual({delta: -100, desired: {"2026-01-05": -100}});
  });

  it("reverses an occurrence that no longer appears in the log", () => {
    const result = computeWalletDelta(
      {"2026-01-05": 100},
      [],
    );

    expect(result).toEqual({delta: -100, desired: {}});
  });

  it("treats a null occurrence log the same as an empty one", () => {
    const result = computeWalletDelta({"2026-01-05": 100}, null);

    expect(result).toEqual({delta: -100, desired: {}});
  });

  it("applies only the difference when an occurrence's value changes", () => {
    const result = computeWalletDelta(
      {"2026-01-05": 100},
      [{date: "2026-01-05", value: 150, type: "credit"}],
    );

    expect(result).toEqual({delta: 50, desired: {"2026-01-05": 150}});
  });

  it("is a no-op when the log already matches what was applied", () => {
    const result = computeWalletDelta(
      {"2026-01-05": 100},
      [{date: "2026-01-05", value: 100, type: "credit"}],
    );

    expect(result).toEqual({delta: 0, desired: {"2026-01-05": 100}});
  });

  it("sums deltas across multiple occurrences of mixed types", () => {
    const result = computeWalletDelta(
      {},
      [
        {date: "2026-01-05", value: 200, type: "credit"},
        {date: "2026-01-06", value: 50, type: "debt"},
      ],
    );

    expect(result).toEqual({
      delta: 150,
      desired: {"2026-01-05": 200, "2026-01-06": -50},
    });
  });
});
