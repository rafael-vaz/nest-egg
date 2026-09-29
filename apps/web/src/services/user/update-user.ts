import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { IUser } from "../../@types/user";
import { db } from "../firebase";

async function updateUserService(
  user: Partial<IUser> & { uid: string },
  hasAlert: boolean = true,
) {
  try {
    const userRef = doc(db, "nest-egg-users", user.uid);
    await setDoc(userRef, user, { merge: true });

    console.log("User updated successfully!");
    if (hasAlert) {
      toast.success("Usuário atualizado com sucesso!");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Falha ao atualizar usuário");
    throw error;
  }
}

export default updateUserService;
