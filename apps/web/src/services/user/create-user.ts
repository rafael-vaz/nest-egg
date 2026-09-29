import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { IUser } from "../../@types/user";
import { db } from "../firebase";

async function createUserService(user: IUser) {
  try {
    const userRef = doc(db, "nest-egg-users", user.uid);
    await setDoc(userRef, user);
    console.log("User registered successfully!");
    toast.success("Cadastro realizado com sucesso!");
  } catch (error) {
    console.error("Error by registering user:", error);
    toast.error("Falha ao realizar cadastro!");
    throw error;
  }
}

export default createUserService;
