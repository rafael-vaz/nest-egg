/**
 * Literal-union types shared verbatim between apps/web and apps/functions.
 *
 * Only types with zero divergence risk live here. `IFrequency`,
 * `IRecurrenceDate`, `ITransaction` and `ITransactionOccurrenceLog` are
 * intentionally NOT unified: apps/functions types recurrence dates as plain
 * `string` (it calls string-only methods like `.includes("T")` on them) and
 * `weekDays` as `number[]`, while apps/web types them as `Date | string` and
 * a branded `WeekDaysId[]`. Forcing one shape on both would either break the
 * functions' string handling or loosen the frontend's type safety — see
 * docs/decisions/0003-shared-types-scope.md.
 */

export type TransactionType = "credit" | "debt";

export type FrequencyCategory = "day" | "week" | "month" | "year";

export type FrequencyOrder = "day-number" | "week-order" | null;
