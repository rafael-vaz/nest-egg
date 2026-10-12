import {describe, expect, it} from "vitest";

import {isAccountExpired} from "./is-account-expired";

describe("isAccountExpired", () => {
  it("is not expired right after creation", () => {
    const now = new Date("2026-01-08T00:00:00.000Z");

    expect(isAccountExpired({
      email: "someone@example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(false);
  });

  it("is not expired just under the limit", () => {
    const now = new Date("2026-01-14T23:59:00.000Z");

    expect(isAccountExpired({
      email: "someone@example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(false);
  });

  it("is expired once the configured number of days has passed", () => {
    const now = new Date("2026-01-15T00:00:00.000Z");

    expect(isAccountExpired({
      email: "someone@example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(true);
  });

  it("is expired well past the limit", () => {
    const now = new Date("2026-06-01T00:00:00.000Z");

    expect(isAccountExpired({
      email: "someone@example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(true);
  });

  it("never expires the exempt email, no matter how old the account is", () => {
    const now = new Date("2030-01-01T00:00:00.000Z");

    expect(isAccountExpired({
      email: "owner@example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(false);
  });

  it("matches the exempt email case-insensitively", () => {
    const now = new Date("2030-01-01T00:00:00.000Z");

    expect(isAccountExpired({
      email: "Owner@Example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(false);
  });

  it("applies normal expiry when no exempt email is configured", () => {
    const now = new Date("2026-06-01T00:00:00.000Z");

    expect(isAccountExpired({
      email: "someone@example.com",
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: undefined,
      expiryDays: 7,
    })).toBe(true);
  });

  it("applies normal expiry when the account has no email", () => {
    const now = new Date("2026-06-01T00:00:00.000Z");

    expect(isAccountExpired({
      email: null,
      creationTime: "2026-01-08T00:00:00.000Z",
      now,
      exemptEmail: "owner@example.com",
      expiryDays: 7,
    })).toBe(true);
  });
});
