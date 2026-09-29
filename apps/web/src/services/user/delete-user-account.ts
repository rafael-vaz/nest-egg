import { deleteUser } from "firebase/auth";

import { auth } from "../firebase";

async function deleteUserAccountService(): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  await deleteUser(user);
  console.log("User account deleted!");
}

export default deleteUserAccountService;
