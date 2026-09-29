import { Loader, LogIn } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { LoginFormData } from "../../schemas/login-form-schema";
import { useAppDispatch } from "../../store/configure-store";
import { loginUserThunk } from "../../store/thunks/user/user-auth";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";
import styles from "./login-submit-button.module.css";

interface ILoginSubmitButton {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<LoginFormData>;
}

const LoginSubmitButton = ({
  loading,
  setLoading,
  handleSubmit,
}: ILoginSubmitButton) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleLogin(data: LoginFormData) {
    try {
      setLoading(true);
      await dispatch(loginUserThunk(data)).unwrap();
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Failure when performing user login:", error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(data);
  };

  const onError = createOnError<LoginFormData>();

  return (
    <Button
      onClick={handleSubmit(onSubmit, onError)}
      aria-label="Realizar login"
      type="submit"
      className={styles.loginSubmitButton}
      disabled={loading}
      text={loading ? "Acessando conta..." : "Acessar"}
      icon={loading ? Loader : LogIn}
      size="fill"
    />
  );
};

export default LoginSubmitButton;
