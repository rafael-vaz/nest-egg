import { GoalStatus } from "../../@types/goal";
import goalStatusMap from "../../templates/goal-status-map";

function getGoalStatusColorById(id: GoalStatus) {
  return goalStatusMap.find((item) => item.id === id)?.statusColor;
}

export default getGoalStatusColorById;
