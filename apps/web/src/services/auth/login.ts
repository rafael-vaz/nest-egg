import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

import { IUser } from "../../@types/user";
import { auth } from "../firebase";
import readUserService from "../user/read-user";

async function loginService(
  userEmail: string,
  password: string,
): Promise<IUser | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userEmail,
      password,
    );
    const { uid } = userCredential.user;
    const registredUser = await readUserService(uid);
    const user: IUser | null = registredUser;
    toast.success("Login realizado com sucesso!");
    return user;
  } catch (error: unknown) {
    let message = "Erro ao tentar fazer login.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/user-not-found":
          message = "Usuário não encontrado.";
          break;
        case "auth/invalid-credential":
          message = "E-mail ou senha incorretos.";
          break;
        case "auth/too-many-requests":
          message = "Muitas tentativas de login. Tente novamente mais tarde.";
          break;
        default:
          console.error("Erro Firebase:", error.code, error.message);
          break;
      }
    } else {
      console.error("Erro inesperado:", error);
    }

    toast.error(message);

    return null;
  }
}

export default loginService;
