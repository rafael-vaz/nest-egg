/**
 * Guards one-off demo-data scripts against running against the wrong
 * account. Throws unless the resolved email is an exact (case-sensitive)
 * match for the expected email.
 * @param {string} resolvedEmail - Email resolved from Firebase Auth for the
 *   uid the script is about to operate on
 * @param {string} expectedEmail - The demo account's email, hardcoded at
 *   the script's call site
 * @return {void}
 */
export function assertDemoUserEmail(
  resolvedEmail: string,
  expectedEmail: string,
): void {
  if (resolvedEmail !== expectedEmail) {
    throw new Error(
      `Refusing to run: resolved user email "${resolvedEmail}" does not ` +
      `exactly match the expected demo account email "${expectedEmail}".`,
    );
  }
}
