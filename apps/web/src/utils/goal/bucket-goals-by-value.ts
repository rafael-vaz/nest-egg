import { IGoal } from "../../@types/goal";

export type GoalValueBucket =
  | "0 - 500"
  | "501 - 2.000"
  | "2.001 - 5.000"
  | "5.001 acima";

// goal.value is stored in cents (see parse-currency.ts); these thresholds
// are written in reais, so they're compared in cents too.
const CENTS_PER_REAL = 100;

function getBucket(valueInCents: number): GoalValueBucket {
  const valueInReais = valueInCents / CENTS_PER_REAL;
  if (valueInReais <= 500) return "0 - 500";
  if (valueInReais <= 2000) return "501 - 2.000";
  if (valueInReais <= 5000) return "2.001 - 5.000";
  return "5.001 acima";
}

function bucketGoalsByValue(goals: IGoal[]): Record<GoalValueBucket, number> {
  const buckets: Record<GoalValueBucket, number> = {
    "0 - 500": 0,
    "501 - 2.000": 0,
    "2.001 - 5.000": 0,
    "5.001 acima": 0,
  };

  goals.forEach((goal) => {
    buckets[getBucket(goal.value)] += 1;
  });

  return buckets;
}

export default bucketGoalsByValue;
