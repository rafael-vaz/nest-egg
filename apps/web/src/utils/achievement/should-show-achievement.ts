export function shouldShowAchievementModal(
  progress: number,
  hasSeenAchievement: boolean | undefined,
): boolean {
  return progress >= 100 && !hasSeenAchievement;
}
