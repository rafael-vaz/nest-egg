import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { Loader, Send } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { toast } from "react-toastify";

import { RecoveryPasswordFormData } from "../../schemas/recovery-password-form.ts";
import { auth } from "../../services/firebase.ts";
import createOnError from "../../utils/form/create-on-error.ts";
import Button from "../button/button.tsx";

interface IRecoveryPasswordSubmitButtonProps {
  loading: boolean;
  handleSubmit: UseFormHandleSubmit<RecoveryPasswordFormData>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = "send_password_reset_cooldown";

const RecoveryPasswordSubmitButton = ({
  loading,
  handleSubmit,
  setLoading,
}: IRecoveryPasswordSubmitButtonProps) => {
  const [cooldown, setCooldown] = React.useState(0);

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

  async function handleSendPasswordReset(email: string) {
    if (!email) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);

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

  const onSubmit = async (data: RecoveryPasswordFormData) => {
    await handleSendPasswordReset(data.email);
  };

  const onError = createOnError<RecoveryPasswordFormData>();

  return (
    <Button
      type="submit"
      aria-label="Enviar link de recuperação de e-mail"
      onClick={handleSubmit(onSubmit, onError)}
      disabled={loading || cooldown > 0}
      icon={loading || cooldown > 0 ? Loader : Send}
      size="fill"
      text={
        loading
          ? "Enviando e-mail..."
          : cooldown > 0
            ? `Aguarde ${cooldown}s para reenviar`
            : "Enviar link de recuperação"
      }
    />
  );
};

export default RecoveryPasswordSubmitButton;
