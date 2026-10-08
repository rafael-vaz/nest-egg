import { describe, expect, it, vi } from "vitest";

vi.mock("../../../services/collection/read-collection", () => ({
  default: vi.fn(() => Promise.reject(new Error("network error"))),
}));
vi.mock("../../../services/collection/delete-collection", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/collection/create-collection", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/collection/read-all-collections", () => ({
  default: vi.fn(() => Promise.resolve([])),
}));
vi.mock("../../../services/collection/update-collection", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/goal/update-goal", () => ({
  default: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../../services/activity/create-activity", () => ({
  default: vi.fn(() => Promise.resolve()),
}));

import deleteCollectionService from "../../../services/collection/delete-collection";
import { deleteCollectionThunk } from "./collection-data";

describe("deleteCollectionThunk", () => {
  it("still deletes the collection when the pre-read (for the activity name) fails", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();

    await deleteCollectionThunk({
      collectionId: "collection-1",
      userId: "user-1",
    })(dispatch, getState, undefined);

    expect(deleteCollectionService).toHaveBeenCalledWith(
      "collection-1",
      "user-1",
    );
  });
});
