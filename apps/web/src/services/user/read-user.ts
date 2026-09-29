import { doc, getDoc } from "firebase/firestore";

import { IUser } from "../../@types/user";
import { db } from "../firebase";

async function readUserService(userId: string): Promise<IUser | null> {
  try {
    const userRef = doc(db, "nest-egg-users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as IUser;
    } else {
      console.warn("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading user:", error);
    throw error;
  }
}

export default readUserService;
