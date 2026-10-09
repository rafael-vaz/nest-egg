import { ActivityEntityType } from "../../@types/activity";
import activityEntityMap from "../../templates/activity-entity-map";

function getActivityEntityById(id: ActivityEntityType) {
  return activityEntityMap.find((item) => item.id === id);
}

export default getActivityEntityById;
