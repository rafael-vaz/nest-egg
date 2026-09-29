import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import { GoalFormData } from "../../schemas/goal-form-schema";
import goalFormSchema from "../../schemas/goal-form-schema";
import goalStatusMap from "../../templates/goal-status-map";
import formatShortDate from "../../utils/date/format-short-date";
import checkInputCurrencyValue from "../../utils/text/check-input-currency-value";
import formatCurrency from "../../utils/text/format-currency";
import formatCurrencyInput from "../../utils/text/format-currency-input";
import CollectionSelector from "../collection/collection-selector";
import GridContainer from "../grid-container/grid-container";
import Input from "../input/input";
import Select from "../select/select";
import TextEditor from "../text-editor/text-editor";
import GoalFormSubmitButton from "./goal-form-submit-button";

export interface IGoalFormValue extends GoalFormData {
  id: string;
}

interface IGoalFormProps {
  actionType?: "create" | "update";
  value?: IGoal;
  onClose: () => void;
}

const GoalForm = ({ actionType, value, onClose }: IGoalFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: React.useMemo(
      () => ({
        ...value,
        name: value?.name ?? "",
        value: value?.value ?? null,
        status: value?.status ?? "unintended",
        collection: value?.collection ?? null,
        description: value?.description ?? "",
      }),
      [value],
    ) as IGoalFormValue,
  });
  const [loading, setLoading] = React.useState(false);
  const valueInputRef = React.useRef<HTMLInputElement | null>(null);

  const reg = register("value", {
    required: true,
    setValueAs: checkInputCurrencyValue,
  });

  React.useEffect(() => {
    if (valueInputRef.current) {
      const el = valueInputRef.current;
      el.value = formatCurrency(`${el.value}`);
      reg.onChange({
        target: el,
        type: "input",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form action="#" aria-label="Fomulário de criação de meta">
      <Input
        id="name"
        type="text"
        label="Nome"
        placeholder="Nome da meta"
        register={register("name")}
        maxLength={40}
        error={errors.name?.message}
      />
      <GridContainer columns={2} rowGap={false}>
        <Input
          id="value"
          type="text"
          label="Valor (R$)"
          placeholder="0,00"
          maxLength={20}
          onInput={formatCurrencyInput}
          register={{
            ...reg,
            ref: (el) => {
              reg.ref(el);
              valueInputRef.current = el;
            },
          }}
          error={errors.value?.message}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              infoBox="Você só pode ter uma meta ativa por vez."
              id="status"
              groups={[{ children: goalStatusMap }]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </GridContainer>
      <Controller
        name="collection"
        control={control}
        render={({ field }) => (
          <CollectionSelector
            id="collection"
            value={field.value as ICollection}
            onChange={field.onChange}
            error={errors.collection?.message}
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
            placeholder="Descreva sua meta brevemente"
            configType="clean"
            value={field.value}
            onChange={field.onChange}
            isRequired={false}
          />
        )}
      />

      <GoalFormSubmitButton
        goalId={value?.id}
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

export default GoalForm;
