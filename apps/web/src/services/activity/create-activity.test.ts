import { describe, expect, it, vi } from "vitest";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => ({})),
  setDoc: vi.fn(() => Promise.reject(new Error("network error"))),
}));

vi.mock("../firebase", () => ({ db: {} }));

import createActivityService from "./create-activity";

describe("createActivityService", () => {
  it("resolves instead of throwing when the Firestore write fails", async () => {
    await expect(
      createActivityService(
        {
          type: "wallet.updated",
          entity: { type: "wallet", id: null, name: null },
        },
        "user-1",
      ),
    ).resolves.toBeUndefined();
  });
});
