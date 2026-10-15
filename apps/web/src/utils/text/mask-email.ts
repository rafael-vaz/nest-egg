const VISIBLE_CHARS = 2;

function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email;

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex);

  if (localPart.length <= VISIBLE_CHARS) return email;

  const visible = localPart.slice(0, VISIBLE_CHARS);
  const masked = "*".repeat(localPart.length - VISIBLE_CHARS);

  return `${visible}${masked}${domain}`;
}

export default maskEmail;
