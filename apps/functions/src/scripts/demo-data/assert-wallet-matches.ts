/**
 * Guards seed-demo-user.ts against silently leaving the wallet at the
 * wrong value. Throws unless the actual wallet exactly equals the
 * dataset's documented baseline.
 * @param {number | undefined} actual - Wallet value read back from
 *   Firestore after reconciliation
 * @param {number} expected - The dataset's walletBaselineCentavos
 * @return {void}
 */
export function assertWalletMatches(
  actual: number | undefined,
  expected: number,
): void {
  if (actual !== expected) {
    throw new Error(
      `Wallet mismatch after seeding: expected ${expected}, got ${actual}.`,
    );
  }
}
