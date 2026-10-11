function calculateGoalProgress(
  walletValue: number,
  goalTargetValue: number,
): number {
  if (goalTargetValue <= 0) return 0;
  return Math.min(100, (walletValue / goalTargetValue) * 100);
}

export default calculateGoalProgress;
