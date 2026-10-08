import { describe, expect, it, vi } from "vitest";

vi.mock("../../../services/goal/read-goal", () => ({
  default: vi.fn(() => Promise.reject(new Error("network error"))),
}));
vi.mock("../../../services/goal/delete-goal", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/collection/read-collection", () => ({
  default: vi.fn(() => Promise.resolve(null)),
}));
vi.mock("../../../services/collection/update-collection", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/goal/create-goal", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/goal/read-all-goals", () => ({
  default: vi.fn(() => Promise.resolve([])),
}));
vi.mock("../../../services/goal/update-goal", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/activity/create-activity", () => ({
  default: vi.fn(() => Promise.resolve()),
}));

import deleteGoalService from "../../../services/goal/delete-goal";
import { deleteGoalThunk } from "./goal-data";

describe("deleteGoalThunk", () => {
  it("still deletes the goal when the pre-read (for the activity name) fails", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();

    await deleteGoalThunk({ goalId: "goal-1", userId: "user-1" })(
      dispatch,
      getState,
      undefined,
    );

    expect(deleteGoalService).toHaveBeenCalledWith("goal-1", "user-1");
  });
});
