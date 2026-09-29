import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { IGoal } from "../../@types/goal";
import { db } from "../firebase";

async function createGoalService(goal: IGoal, userId: string) {
  try {
    const goalRef = doc(db, "nest-egg-users", userId, "goals", goal.id);
    await setDoc(goalRef, goal);
    console.log("Successfully created goal!");
    toast.success("Meta criada com sucesso!");
  } catch (error) {
    console.error("Error when creating goal:", error);
    toast.error("Falha ao criar meta");
    throw error;
  }
}

export default createGoalService;
