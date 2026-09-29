import { CircleCheckBig, Loader } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { ICollection } from "../../@types/collection";
import { CollectionFormData } from "../../schemas/collection-form-schema";
import { RootState, useAppDispatch } from "../../store/configure-store";
import {
  createCollectionThunk,
  updateCollectionThunk,
} from "../../store/thunks/collection/collection-data";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";

interface ICollectionFormSubmitButtonProps {
  collectionId?: string;
  actionType?: "create" | "update";
  hasAlt: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<CollectionFormData>;
  reset: UseFormReset<CollectionFormData>;
  onClose: () => void;
}

const CollectionFormSubmitButton = ({
  collectionId,
  actionType = "create",
  hasAlt,
  loading,
  setLoading,
  handleSubmit,
  onClose,
}: ICollectionFormSubmitButtonProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useAppDispatch();
  const currentDate = new Date().toISOString();
  const actionTypeButtonText = {
    create: {
      default: "Criar coleção",
      loading: "Criando coleção...",
    },
    update: {
      default: "Salvar alterações",
      loading: "Salvando alterações...",
    },
  };

  async function handleCreateCollection(data: CollectionFormData) {
    const newCollection = {
      id: uuidv4(),
      ...data,
      goals: data.goals ? data.goals.map((goal) => ({ id: goal.id })) : null,
      description: data.description ? data.description : null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    try {
      setLoading(true);
      await dispatch(
        createCollectionThunk({
          userId: authUser!.uid,
          collection: newCollection,
        }),
      );
    } catch (error) {
      console.log(`Error when registering collection: ${error}`);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  async function handleUpdateCollection(data: CollectionFormData) {
    const updatedCollection = {
      id: collectionId,
      ...data,
      goals: data.goals ? data.goals.map((goal) => ({ id: goal.id })) : null,
      description: data.description ? data.description : null,
      updatedAt: currentDate,
    } as ICollection;

    try {
      setLoading(true);
      await dispatch(
        updateCollectionThunk({
          userId: authUser!.uid,
          collection: updatedCollection,
          hasAlert: true,
        }),
      );
    } catch (error) {
      console.log(`Error when updating collection: ${error}`);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  const onSubmit = async (data: CollectionFormData) => {
    switch (actionType) {
      case "create":
        await handleCreateCollection(data);
        break;
      case "update":
        await handleUpdateCollection(data);
        break;
    }
  };

  const onError = createOnError<CollectionFormData>();

  return (
    <Button
      type="submit"
      aria-label={actionTypeButtonText[actionType].default}
      text={
        loading
          ? actionTypeButtonText[actionType].loading
          : actionTypeButtonText[actionType].default
      }
      icon={loading ? Loader : CircleCheckBig}
      disabled={loading || hasAlt}
      size="fill"
      onClick={handleSubmit(onSubmit, onError)}
    />
  );
};

export default CollectionFormSubmitButton;
