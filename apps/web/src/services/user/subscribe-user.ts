import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";

import { IUser } from "../../@types/user";
import { db } from "../firebase";

function subscribeToUser(
  userId: string,
  onUpdate: (user: IUser) => void,
): Unsubscribe {
  const userRef = doc(db, "nest-egg-users", userId);

  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (!snapshot.exists()) return;
      onUpdate(snapshot.data() as IUser);
    },
    (error) => {
      console.error("Error listening to user:", error);
    },
  );

  return unsubscribe;
}

export default subscribeToUser;
