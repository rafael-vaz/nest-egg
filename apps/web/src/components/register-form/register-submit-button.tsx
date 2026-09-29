import { CircleCheckBig, Loader } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { IUser } from "../../@types/user";
import { RegisterFormData } from "../../schemas/register-form-schema";
import { useAppDispatch } from "../../store/configure-store";
import { createUserAccountThunk } from "../../store/thunks/user/user-auth";
import { createUserThunk } from "../../store/thunks/user/user-data";
import defaultCoversMap from "../../templates/default-covers-map";
import createOnError from "../../utils/form/create-on-error";
import capitalizeText from "../../utils/text/capitalize-text";
import Button from "../button/button";
import styles from "./register-submit-button.module.css";

interface IRegisterSubmitButtonProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData>;
  reset: UseFormReset<RegisterFormData>;
}

const RegisterSubmitButton = ({
  loading,
  reset,
  setLoading,
  handleSubmit,
}: IRegisterSubmitButtonProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleUserRegister(data: RegisterFormData) {
    try {
      setLoading(true);
      const uid = await dispatch(
        createUserAccountThunk({ email: data.email, password: data.password }),
      ).unwrap();
      const newUser: IUser = {
        uid,
        photoURL: null,
        coverURL: defaultCoversMap[0],
        emailVerified: false,
        name: capitalizeText(data.name),
        email: data.email,
        dateOfBirth: data.dateOfBirth.toISOString(),
        wallet: 0,
      };
      await dispatch(createUserThunk(newUser)).unwrap();
      reset();
      navigate("/confirm-email", { replace: true });
    } catch (error) {
      console.log(`Error in registering user: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    handleUserRegister(data);
  };

  const onError = createOnError<RegisterFormData>();

  return (
    <Button
      type="submit"
      aria-label="Realizar cadastro"
      text={loading ? "Cadastrando..." : "Cadastrar"}
      icon={loading ? Loader : CircleCheckBig}
      size="fill"
      className={styles.registerSubmitButton}
      disabled={loading}
      onClick={handleSubmit(onSubmit, onError)}
    />
  );
};

export default RegisterSubmitButton;
