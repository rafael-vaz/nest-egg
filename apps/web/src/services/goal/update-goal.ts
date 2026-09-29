import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { IGoal } from "../../@types/goal";
import { db } from "../firebase";

async function updateGoalService(
  goal: Partial<IGoal> & { id: string },
  userId: string,
  hasAlert: boolean = true,
) {
  try {
    const goalRef = doc(db, "nest-egg-users", userId, "goals", goal.id);
    await setDoc(goalRef, goal, { merge: true });

    console.log("Goal updated successfully!");
    if (hasAlert) {
      toast.success("Meta atualizada com sucesso!");
    }
  } catch (error) {
    console.error("Error updating goal:", error);
    toast.error("Falha ao atualizar meta!");
    throw error;
  }
}

export default updateGoalService;
