import { IGoal } from "../../@types/goal";

function getCompletedGoalRate(goals: IGoal[]) {
  if (goals.length === 0) return 0;

  const completedIndex = goals.reduce(
    (acc, goal) => (goal?.status === "completed" ? acc + 1 : acc),
    0
  );
  return Number((completedIndex / goals.length).toFixed(2));
}

export default getCompletedGoalRate;
