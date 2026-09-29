import { Loader, RefreshCcw } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

import { auth } from "../../services/firebase.ts";
import sendEmailVerificationService from "../../services/user/send-email-verification";
import Button from "../button/button";

interface IResendEmailNoticeButtonProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = "resend_verification_cooldown";

export const ResendEmailNoticeButton = ({
  loading,
  setLoading,
}: IResendEmailNoticeButtonProps) => {
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

  async function handleResendEmailNotice() {
    const user = auth.currentUser;
    if (user) {
      try {
        setLoading(true);
        await sendEmailVerificationService(user);

        const cooldownUntil = Date.now() + COOLDOWN_SECONDS * 1000;
        localStorage.setItem(STORAGE_KEY, cooldownUntil.toString());
        setCooldown(COOLDOWN_SECONDS);

        toast.success("E-mail de confirmação reenviado!");
      } catch (error) {
        console.error("Error when resend confirmation email:", error);
        toast.error("Erro ao enviar e-mail de confirmação. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Button
      onClick={handleResendEmailNotice}
      aria-label="Reenviar e-mail de confirmação"
      disabled={loading || cooldown > 0}
      icon={loading || cooldown > 0 ? Loader : RefreshCcw}
      color="dark-gray"
      size="fill"
      text={
        loading
          ? "Reenviando e-mail..."
          : cooldown > 0
            ? `Aguarde ${cooldown}s para reenviar`
            : "Reenviar e-mail de confirmação"
      }
    />
  );
};
