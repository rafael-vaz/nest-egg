import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { KeyRound, Loader } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { auth } from "../../services/firebase.ts";
import { RootState } from "../../store/configure-store.ts";
import Button from "../button/button.tsx";
import styles from "./profile-recovery-password-button.module.css";

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = "send_password_reset_cooldown";

const ProfileRecoveryPasswordButton = () => {
  const [loading, setLoading] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const { authUser } = useSelector((state: RootState) => state.userAuth);

  React.useEffect(() => {
    const savedCooldown = localStorage.getItem(STORAGE_KEY);
    if (savedCooldown) {
      const cooldownUntil = parseInt(savedCooldown, 10);
      const now = Date.now();
      const diff = Math.ceil((cooldownUntil - now) / 1000);

      if (diff > 0) {
        setCooldown(diff);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((state) => {
        if (state <= 1) {
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return state - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleClick() {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, authUser!.email);

      const cooldownUntil = Date.now() + COOLDOWN_SECONDS * 1000;
      localStorage.setItem(STORAGE_KEY, cooldownUntil.toString());
      setCooldown(COOLDOWN_SECONDS);

      toast.success("E-mail de redefinição de senha enviado!");
    } catch (error: unknown) {
      console.error("Error sending password redefinition email:", error);
      if (error instanceof FirebaseError) {
        toast.error(
          error.code === "auth/user-not-found"
            ? "Usuário não encontrado."
            : "Erro ao enviar e-mail. Tente novamente.",
        );
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      color="transparent"
      aria-label="Alterar senha"
      disabled={loading || cooldown > 0}
      icon={loading || cooldown > 0 ? Loader : KeyRound}
      onClick={handleClick}
      className={styles.profileRecoveryPasswordButton}
      text={
        loading
          ? "Enviando e-mail..."
          : cooldown > 0
            ? `Aguarde ${cooldown}s para reenviar`
            : "Alterar senha"
      }
    />
  );
};

export default ProfileRecoveryPasswordButton;
