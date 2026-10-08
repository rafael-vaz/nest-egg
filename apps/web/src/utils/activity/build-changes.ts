export function buildChanges<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>,
  keys: (keyof T)[],
): Record<string, { from: unknown; to: unknown }> | undefined {
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  for (const key of keys) {
    if (!(key in after)) continue;

    const beforeValue = before[key];
    const afterValue = after[key];

    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changes[key as string] = { from: beforeValue, to: afterValue };
    }
  }

  return Object.keys(changes).length > 0 ? changes : undefined;
}
