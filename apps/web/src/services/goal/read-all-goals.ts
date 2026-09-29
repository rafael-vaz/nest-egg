import { collection, getDocs } from "firebase/firestore";

import { IGoal } from "../../@types/goal";
import { db } from "../firebase";

async function readAllGoalsService(userId: string): Promise<IGoal[]> {
  try {
    const goalsRef = collection(db, "nest-egg-users", userId, "goals");
    const goalsSnap = await getDocs(goalsRef);
    const goals: IGoal[] = goalsSnap.docs.map((doc) => doc.data() as IGoal);
    return goals;
  } catch (error) {
    console.error("Error reading all goals:", error);
    throw error;
  }
}

export default readAllGoalsService;
