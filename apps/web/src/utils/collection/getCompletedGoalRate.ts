import { IGoal } from "../../@types/goal";

function getCompletedGoalRate(goals: IGoal[]) {
  const totalGoals = goals.length ?? 0;
  const completedIndex = goals.reduce(
    (acc, goal) => (goal?.status === "completed" ? acc + 1 : acc),
    0
  );
  return Number((completedIndex / totalGoals).toFixed(2));
}

export default getCompletedGoalRate;
