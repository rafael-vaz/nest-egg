export function shouldAutoStartTutorial(
  hasSeenTutorial: boolean | undefined,
  isDesktopViewport: boolean,
): boolean {
  return !hasSeenTutorial && isDesktopViewport;
}
