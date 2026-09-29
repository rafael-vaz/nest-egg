import { doc, getDoc } from "firebase/firestore";

import { IGoal } from "../../@types/goal";
import { db } from "../firebase";

async function readGoalService(
  goalId: string,
  userId: string
): Promise<IGoal | null> {
  try {
    const goalRef = doc(db, "nest-egg-users", userId, "goals", goalId);
    const userSnap = await getDoc(goalRef);

    if (userSnap.exists()) {
      return userSnap.data() as IGoal;
    } else {
      console.warn("Goal not found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading goal:", error);
    throw error;
  }
}

export default readGoalService;
