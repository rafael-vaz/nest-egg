import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";

async function deleteUserService(userId: string) {
  try {
    const userRef = doc(db, "nest-egg-users", userId);
    await deleteDoc(userRef);
    console.log("User deleted successfully!");
    toast.success("Usuário removido com sucesso!");
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Falha ao remover usuário!");
    throw error;
  }
}

export default deleteUserService;
