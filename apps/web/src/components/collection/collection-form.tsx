import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import collectionFormSchema, {
  CollectionFormData,
} from "../../schemas/collection-form-schema";
import formatShortDate from "../../utils/date/format-short-date";
import GoalSelector from "../goal/goal-selector";
import Input from "../input/input";
import TextEditor from "../text-editor/text-editor";
import CollectionFormSubmitButton from "./collection-form-submit-button";

export interface ICollectionFormValue extends CollectionFormData {
  id: string;
}

interface ICollectionFormProps {
  actionType?: "create" | "update";
  value?: ICollection;
  onClose: () => void;
}

const CollectionForm = ({
  actionType,
  value,
  onClose,
}: ICollectionFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: React.useMemo(
      () => ({
        ...value,
        name: value?.name ?? "",
        description: value?.description ?? "",
        goals: value?.goals ?? null,
      }),
      [value],
    ) as ICollectionFormValue,
  });

  const [loading, setLoading] = React.useState(false);

  return (
    <form action="#" aria-label="Fomulário de criação de coleção">
      <Input
        id="name"
        type="text"
        label="Nome"
        placeholder="Nome da coleção"
        register={register("name")}
        maxLength={40}
        error={errors.name?.message}
      />
      <Controller
        name="goals"
        control={control}
        render={({ field }) => (
          <GoalSelector
            id="goals"
            noCollectGoals={true}
            value={field.value as IGoal[]}
            onChange={field.onChange}
            error={errors.goals?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextEditor
            id="description"
            label="Descrição"
            placeholder="Descreva sua coleção brevemente"
            configType="clean"
            value={field.value}
            onChange={field.onChange}
            isRequired={false}
          />
        )}
      />
      <CollectionFormSubmitButton
        collectionId={value?.id}
        actionType={actionType}
        loading={loading}
        setLoading={setLoading}
        reset={reset}
        handleSubmit={handleSubmit}
        onClose={onClose}
        hasAlt={!isDirty}
      />

      {actionType === "update" && (
        <p className="formWarningText">{`Atualizado em: ${formatShortDate(new Date(value!.updatedAt))}`}</p>
      )}
    </form>
  );
};

export default CollectionForm;
