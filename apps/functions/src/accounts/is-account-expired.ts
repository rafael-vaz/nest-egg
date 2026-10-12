interface IsAccountExpiredParams {
  email: string | null | undefined;
  creationTime: string;
  now: Date;
  exemptEmail: string | null | undefined;
  expiryDays: number;
}

/**
 * Decides whether an account has aged past the trial window, exempting a
 * single configured email (the project owner's) from expiry entirely.
 * @param {IsAccountExpiredParams} params - Account and policy inputs
 * @return {boolean} True if the account should be deleted
 */
export function isAccountExpired(params: IsAccountExpiredParams): boolean {
  const {email, creationTime, now, exemptEmail, expiryDays} = params;

  if (
    exemptEmail &&
    email &&
    email.trim().toLowerCase() === exemptEmail.trim().toLowerCase()
  ) {
    return false;
  }

  const ageMs = now.getTime() - new Date(creationTime).getTime();
  const expiryMs = expiryDays * 24 * 60 * 60 * 1000;

  return ageMs >= expiryMs;
}
