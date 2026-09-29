import { Loader, Trash } from "lucide-react";
import React from "react";
import { SubmitErrorHandler, UseFormHandleSubmit } from "react-hook-form";
import { useSelector } from "react-redux";

import { DeleteUserAccountFormData } from "../../schemas/delete-user-account-form-schem";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { deleteUserAccountThunk } from "../../store/thunks/user/user-auth";
import Button from "../button/button";

interface IDeleteUserAccountSubmitButton {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<DeleteUserAccountFormData>;
}

const DeleteUserAccountSubmitButton = ({
  loading,
  setLoading,
  handleSubmit,
}: IDeleteUserAccountSubmitButton) => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);

  async function handleConfirmDeleteUserAccount(
    data: DeleteUserAccountFormData
  ) {
    try {
      setLoading(true);
      await dispatch(
        deleteUserAccountThunk({
          uid: authUser!.uid,
          email: authUser!.email,
          password: data.password,
        })
      );
    } catch (error) {
      console.error(
        "Error unknown when trying to delete the user's account.",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: DeleteUserAccountFormData) => {
    await handleConfirmDeleteUserAccount(data);
  };

  const onError: SubmitErrorHandler<DeleteUserAccountFormData> = (errors) => {
    const mappedErros = Object.entries(errors).map(([key, value]) => {
      return {
        key: key as keyof typeof errors,
        value: value?.message,
      };
    });
    console.log("Fields with validation errors:");
    console.log(mappedErros);
  };

  return (
    <Button
      onClick={handleSubmit(onSubmit, onError)}
      type="submit"
      text={loading ? "Deletando..." : "Confirmar"}
      aria-label="Confirmar exclusão de conta"
      icon={loading ? Loader : Trash}
      color="error"
      size="fill"
      disabled={loading}
    />
  );
};

export default DeleteUserAccountSubmitButton;
