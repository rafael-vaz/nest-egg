import { describe, expect, it } from "vitest";

import tutorialReducer, { startTutorial, stopTutorial } from "./tutorial";

describe("tutorial reducer", () => {
  it("starts with run set to false", () => {
    expect(tutorialReducer(undefined, { type: "@@INIT" })).toEqual({
      run: false,
    });
  });

  it("sets run to true on startTutorial", () => {
    const state = tutorialReducer({ run: false }, startTutorial());
    expect(state.run).toBe(true);
  });

  it("sets run to false on stopTutorial", () => {
    const state = tutorialReducer({ run: true }, stopTutorial());
    expect(state.run).toBe(false);
  });
});
