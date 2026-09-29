import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../firebase";

async function reauthenticateUserService(email: string, password: string) {
  const user = auth.currentUser;

  if (!user) throw new Error("Usuário não está autenticado.");

  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error("Error when reauthenticating user.", error);
    toast.error("A senha informada é inválida.");
    throw error;
  }
}

export default reauthenticateUserService;
