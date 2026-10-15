import { describe, expect, it } from "vitest";

import filterOptionsBySearch from "./filter-options-by-search";

const options = [
  { id: "food", value: "Alimentação" },
  { id: "travel", value: "Viagens" },
  { id: "debts", value: "Dívidas" },
];

describe("filterOptionsBySearch", () => {
  it("returns all options when the search term is empty", () => {
    expect(filterOptionsBySearch("", options)).toEqual(options);
  });

  it("matches options containing the search term, case-insensitively", () => {
    expect(filterOptionsBySearch("viag", options)).toEqual([
      { id: "travel", value: "Viagens" },
    ]);
  });

  it("matches ignoring accents in both the term and the option", () => {
    expect(filterOptionsBySearch("alimentacao", options)).toEqual([
      { id: "food", value: "Alimentação" },
    ]);
  });

  it("does not return unrelated options as fuzzy matches", () => {
    expect(filterOptionsBySearch("viag", options)).not.toContainEqual({
      id: "debts",
      value: "Dívidas",
    });
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterOptionsBySearch("xyz", options)).toEqual([]);
  });
});
