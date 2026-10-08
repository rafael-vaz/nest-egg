import { describe, expect, it, vi } from "vitest";

vi.mock("../../../services/activity/read-all-activities", () => ({
  default: vi.fn(() => Promise.reject(new Error("network error"))),
}));

import { readAllActivitiesThunk } from "./activity-data";

describe("readAllActivitiesThunk", () => {
  it("rejects with the error message when the service fails", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await readAllActivitiesThunk({ userId: "user-1" })(
      dispatch,
      getState,
      undefined,
    );

    expect(result.payload).toBe("network error");
  });
});
