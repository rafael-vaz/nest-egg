const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses a value into a Date using local-time semantics throughout.
 * A plain "YYYY-MM-DD" string is otherwise parsed by the native Date
 * constructor as UTC midnight, which silently shifts by a day in any
 * timezone behind UTC when compared against locally-constructed dates.
 */
function parseLocalDate(value: Date | string): Date {
  if (value instanceof Date) return value;

  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

export default parseLocalDate;
