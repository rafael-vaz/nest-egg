import {describe, expect, it} from "vitest";
import {assertDemoUserEmail} from "./assert-demo-user-email";

describe("assertDemoUserEmail", () => {
  it("throws when the resolved email differs from the expected email", () => {
    expect(() =>
      assertDemoUserEmail("wrong@live.com", "ferreira.vaz@live.com"),
    ).toThrow();
  });

  it("throws when the emails differ only in case", () => {
    expect(() =>
      assertDemoUserEmail("Ferreira.Vaz@live.com", "ferreira.vaz@live.com"),
    ).toThrow();
  });

  it("does not throw when the emails match exactly", () => {
    expect(() =>
      assertDemoUserEmail("ferreira.vaz@live.com", "ferreira.vaz@live.com"),
    ).not.toThrow();
  });

  it("includes both emails in the thrown message", () => {
    expect(() =>
      assertDemoUserEmail("wrong@live.com", "ferreira.vaz@live.com"),
    ).toThrow(/wrong@live\.com.*ferreira\.vaz@live\.com/);
  });
});
