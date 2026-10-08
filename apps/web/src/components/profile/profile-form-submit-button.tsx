import { CircleCheckBig, Loader } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { useSelector } from "react-redux";

import { ProfileFormData } from "../../schemas/profile-form-schema";
import createActivityService from "../../services/activity/create-activity";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import { buildChanges } from "../../utils/activity/build-changes";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";
import styles from "./profile-form-submit-button.module.css";

interface IProfileFormSubmitButtonProps {
  loading: boolean;
  hasAlt: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<ProfileFormData>;
}

const ProfileFormSubmitButton = ({
  loading,
  hasAlt,
  setLoading,
  handleSubmit,
}: IProfileFormSubmitButtonProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useAppDispatch();

  async function handleUserUpdate(data: ProfileFormData) {
    const newUserData = {
      uid: authUser!.uid,
      name: data.name,
      dateOfBirth: data.dateOfBirth.toISOString(),
      wallet: data.wallet,
    };
    try {
      setLoading(true);
      await dispatch(updateUserThunk(newUserData)).unwrap();
      dispatch(updateAuthUser(newUserData));

      const profileChanges = buildChanges(
        authUser! as unknown as Record<string, unknown>,
        newUserData,
        ["name", "dateOfBirth"],
      );
      if (profileChanges) {
        await createActivityService(
          {
            type: "profile.updated",
            entity: { type: "profile", id: null, name: null },
            changes: profileChanges,
          },
          authUser!.uid,
        );
      }

      const walletChanges = buildChanges(
        authUser! as unknown as Record<string, unknown>,
        newUserData,
        ["wallet"],
      );
      if (walletChanges) {
        await createActivityService(
          {
            type: "wallet.updated",
            entity: { type: "wallet", id: null, name: null },
            changes: { value: walletChanges.wallet },
          },
          authUser!.uid,
        );
      }
    } catch (error) {
      console.log(`Error in registering user: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    handleUserUpdate(data);
  };

  const onError = createOnError<ProfileFormData>();

  return (
    <Button
      type="submit"
      aria-label="Salvar alterações"
      text={loading ? "Salvando..." : "Salvar alterações"}
      icon={loading ? Loader : CircleCheckBig}
      size="fill"
      className={styles.profileFormSubmitButton}
      disabled={loading || hasAlt}
      onClick={handleSubmit(onSubmit, onError)}
    />
  );
};

export default ProfileFormSubmitButton;
