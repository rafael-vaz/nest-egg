import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../firebase";

async function logoutService() {
  try {
    await signOut(auth);
    toast.success("Logout realizado com sucesso!");
  } catch (error) {
    console.error("Error when doing Logout:", error);
    toast.error("Falha ao realizar logout.");
    throw error;
  }
}

export default logoutService;
