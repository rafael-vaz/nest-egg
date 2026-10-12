import { describe, expect, it } from "vitest";

import { IRecurrenceDate } from "../../@types/recurrence-date";
import getRecurrenceDescription from "./get-recurrence-description";

interface IBuildRecurrenceOptions {
  startDate?: IRecurrenceDate["startDate"];
  endDate?: IRecurrenceDate["endDate"];
  frequency?: Partial<NonNullable<IRecurrenceDate["frequency"]>> | null;
}

function buildRecurrence(options: IBuildRecurrenceOptions): IRecurrenceDate {
  return {
    startDate: options.startDate ?? "2026-01-01",
    endDate: options.endDate ?? null,
    frequency:
      options.frequency === null
        ? null
        : {
            rate: 1,
            category: "day",
            weekDays: null,
            order: null,
            ...options.frequency,
          },
  };
}

describe("getRecurrenceDescription", () => {
  it("returns a placeholder when there is no recurrence", () => {
    expect(getRecurrenceDescription(null)).toBe("Sem recorrência");
  });

  it("returns a placeholder when the recurrence has no frequency", () => {
    expect(getRecurrenceDescription(buildRecurrence({ frequency: null }))).toBe(
      "Sem recorrência",
    );
  });

  it("describes a daily recurrence with rate 1", () => {
    const recurrence = buildRecurrence({
      frequency: { category: "day", rate: 1 },
    });

    expect(getRecurrenceDescription(recurrence)).toBe("Diariamente");
  });

  it("describes a daily recurrence with a custom rate", () => {
    const recurrence = buildRecurrence({
      frequency: { category: "day", rate: 3 },
    });

    expect(getRecurrenceDescription(recurrence)).toBe("A cada 3 dias");
  });

  it("describes a weekly recurrence with specific weekdays", () => {
    const recurrence = buildRecurrence({
      frequency: {
        category: "week",
        rate: 1,
        weekDays: ["monday", "wednesday"],
      },
    });

    expect(getRecurrenceDescription(recurrence)).toBe(
      "Semanalmente, nas(os) Segunda-feira e Quarta-feira",
    );
  });

  it("describes a monthly recurrence by day number", () => {
    const recurrence = buildRecurrence({
      frequency: {
        category: "month",
        rate: 1,
        order: "day-number",
        weekDays: ["5" as never],
      },
    });

    expect(getRecurrenceDescription(recurrence)).toBe("Mensalmente, no dia 5");
  });

  it("describes a yearly recurrence", () => {
    const recurrence = buildRecurrence({
      frequency: { category: "year", rate: 1 },
    });

    expect(getRecurrenceDescription(recurrence)).toBe("Anualmente");
  });

  it("appends the end date when present", () => {
    const recurrence = buildRecurrence({
      frequency: { category: "day", rate: 1 },
      endDate: "2026-12-31",
    });

    expect(getRecurrenceDescription(recurrence)).toBe(
      "Diariamente até 31/12/26",
    );
  });
});
