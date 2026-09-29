import { CheckCircle, Loader } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import checkUserEmailVerificationService from "../../services/user/check-user-email-verification";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import Button from "../button/button";

interface IConfirmEmailNoticeButtonProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmEmailNoticeButton = ({
  loading,
  setLoading,
}: IConfirmEmailNoticeButtonProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);

  async function handleConfirmEmailVerification() {
    setLoading(true);
    try {
      const isVerified = await checkUserEmailVerificationService();
      if (isVerified && authUser) {
        await dispatch(
          updateUserThunk({
            uid: authUser.uid,
            emailVerified: true,
            hasAlert: false,
          }),
        );
        dispatch(updateAuthUser({ ...authUser, emailVerified: true }));
        navigate("/home", { replace: true });
        toast.success("E-mail confirmado com sucesso!");
      } else {
        toast.error("O e-mail ainda não foi confirmado!");
      }
    } catch (error) {
      console.error("Error when checking email:", error);
      toast.error("Ocorreu um erro ao verificar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      icon={loading ? Loader : CheckCircle}
      text={loading ? "Verificando confirmação..." : "Já confirmei meu e-mail"}
      aria-label="Confirmar verificação de e-mail"
      onClick={handleConfirmEmailVerification}
      size="fill"
      disabled={loading}
    />
  );
};

export default ConfirmEmailNoticeButton;
