export function shouldAutoStartTutorial(
  hasSeenTutorial: boolean | undefined,
): boolean {
  return !hasSeenTutorial;
}
