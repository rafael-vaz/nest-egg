import { collection, getDocs } from "firebase/firestore";

import { IActivity } from "../../@types/activity";
import { db } from "../firebase";

async function readAllActivitiesService(
  userId: string,
): Promise<IActivity[]> {
  try {
    const activitiesRef = collection(
      db,
      "nest-egg-users",
      userId,
      "activities",
    );
    const activitiesSnap = await getDocs(activitiesRef);
    const activities: IActivity[] = activitiesSnap.docs.map(
      (doc) => doc.data() as IActivity,
    );
    return activities;
  } catch (error) {
    console.error("Error reading all activities:", error);
    throw error;
  }
}

export default readAllActivitiesService;
