function normalizeEmpty(value: unknown): unknown {
  return value === undefined || value === null || value === "" ? null : value;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const entries = Object.keys(value as Record<string, unknown>).sort();
  return `{${entries
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableStringify(
          (value as Record<string, unknown>)[key],
        )}`,
    )
    .join(",")}}`;
}

export function buildChanges<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>,
  keys: (keyof T)[],
): Record<string, { from: unknown; to: unknown }> | undefined {
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  for (const key of keys) {
    if (!(key in after)) continue;

    const beforeValue = normalizeEmpty(before[key]);
    const afterValue = normalizeEmpty(after[key]);

    if (stableStringify(beforeValue) !== stableStringify(afterValue)) {
      changes[key as string] = { from: beforeValue, to: afterValue };
    }
  }

  return Object.keys(changes).length > 0 ? changes : undefined;
}
