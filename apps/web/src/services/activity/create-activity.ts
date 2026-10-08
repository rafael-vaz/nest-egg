import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { IActivity } from "../../@types/activity";
import { db } from "../firebase";

async function createActivityService(
  activity: Omit<IActivity, "id" | "createdAt">,
  userId: string,
): Promise<void> {
  try {
    const id = uuidv4();
    const fullActivity: IActivity = {
      ...activity,
      id,
      createdAt: new Date().toISOString(),
    };
    const activityRef = doc(db, "nest-egg-users", userId, "activities", id);
    await setDoc(activityRef, fullActivity);
  } catch (error) {
    // Intencional: nunca relança. A escrita do log é melhor-esforço e não
    // pode fazer uma ação principal já bem-sucedida parecer que falhou.
    console.error("Error creating activity log entry:", error);
  }
}

export default createActivityService;
