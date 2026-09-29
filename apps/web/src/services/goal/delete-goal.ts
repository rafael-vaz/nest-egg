import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";

async function deleteGoalService(goalId: string, userId: string) {
  try {
    const goalRef = doc(db, "nest-egg-users", userId, "goals", goalId);
    await deleteDoc(goalRef);
    console.log("Goal deleted successfully!");
    toast.success("Meta removida com sucesso!");
  } catch (error) {
    console.error("Error deleting goal:", error);
    toast.error("Falha ao remover meta!");
    throw error;
  }
}

export default deleteGoalService;
