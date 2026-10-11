import { IGoal } from "../../@types/goal";
import calculateGoalProgress from "./calculate-goal-progress";

export type GoalProgressBucket =
  | "0 - 25%"
  | "25 - 50%"
  | "50 - 75%"
  | "75 - 100%";

function getBucket(progress: number): GoalProgressBucket {
  if (progress < 25) return "0 - 25%";
  if (progress < 50) return "25 - 50%";
  if (progress < 75) return "50 - 75%";
  return "75 - 100%";
}

function bucketGoalsByProgress(
  goals: IGoal[],
  walletValue: number,
): Record<GoalProgressBucket, number> {
  const buckets: Record<GoalProgressBucket, number> = {
    "0 - 25%": 0,
    "25 - 50%": 0,
    "50 - 75%": 0,
    "75 - 100%": 0,
  };

  goals.forEach((goal) => {
    const progress = calculateGoalProgress(walletValue, goal.value);
    buckets[getBucket(progress)] += 1;
  });

  return buckets;
}

export default bucketGoalsByProgress;
