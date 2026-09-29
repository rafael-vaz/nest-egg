import { createUserWithEmailAndPassword, User } from "firebase/auth";

import { auth } from "../firebase";

async function createUserAccountService(
  email: string,
  password: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  console.log("User account created!");
  return user;
}

export default createUserAccountService;
