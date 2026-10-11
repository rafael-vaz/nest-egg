export function shouldShowWelcomeModal(
  hasSeenWelcome: boolean | undefined,
): boolean {
  return !hasSeenWelcome;
}
