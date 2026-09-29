import { CircleCheckBig, Loader } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { IGoal } from "../../@types/goal";
import { GoalFormData } from "../../schemas/goal-form-schema";
import { RootState, useAppDispatch } from "../../store/configure-store";
import {
  createGoalThunk,
  updateGoalThunk,
} from "../../store/thunks/goal/goal-data";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";

interface IGoalFormSubmitButtonProps {
  goalId?: string;
  actionType?: "create" | "update";
  hasAlt: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<GoalFormData>;
  reset: UseFormReset<GoalFormData>;
  onClose: () => void;
}

const GoalFormSubmitButton = ({
  goalId,
  actionType = "create",
  hasAlt,
  loading,
  setLoading,
  handleSubmit,
  onClose,
}: IGoalFormSubmitButtonProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useAppDispatch();
  const currentDate = new Date().toISOString();
  const actionTypeButtonText = {
    create: {
      default: "Criar meta",
      loading: "Criando meta...",
    },
    update: {
      default: "Salvar alterações",
      loading: "Salvando alterações...",
    },
  };

  async function handleCreateGoal(data: GoalFormData) {
    const newGoal = {
      id: uuidv4(),
      ...data,
      collection: data.collection ? { id: data.collection.id } : null,
      description: data.description ? data.description : null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    try {
      setLoading(true);
      await dispatch(createGoalThunk({ userId: authUser!.uid, goal: newGoal }));
    } catch (error) {
      console.log(`Error when registering goal: ${error}`);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  async function handleUpdateGoal(data: GoalFormData) {
    const updatedGoal = {
      id: goalId,
      ...data,
      collection: data.collection ? { id: data.collection.id } : null,
      description: data.description ? data.description : null,
      updatedAt: currentDate,
    } as IGoal;

    try {
      setLoading(true);
      await dispatch(
        updateGoalThunk({
          userId: authUser!.uid,
          goal: updatedGoal,
          hasAlert: true,
        }),
      );
    } catch (error) {
      console.log(`Error when updating goal: ${error}`);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  const onSubmit = async (data: GoalFormData) => {
    switch (actionType) {
      case "create":
        await handleCreateGoal(data);
        break;
      case "update":
        await handleUpdateGoal(data);
        break;
    }
  };

  const onError = createOnError<GoalFormData>();

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

export default GoalFormSubmitButton;
