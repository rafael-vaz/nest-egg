import activityActionMap from "../../templates/activity-action-map";
import { ActivityAction } from "./get-activity-action-by-type";

function getActivityActionValueById(id: ActivityAction) {
  return activityActionMap.find((item) => item.id === id)?.value;
}

export default getActivityActionValueById;
