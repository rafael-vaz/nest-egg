import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { ITransaction } from "../../@types/transaction";
import transactionFormSchema, {
  TransactionFormData,
} from "../../schemas/transaction-form-schema";
import { useAppDispatch } from "../../store/configure-store";
import { updateRecurrence } from "../../store/reducers/recurrence-date/recurrence-date";
import transactionCategoryMap from "../../templates/transaction-category-map";
import formatShortDate from "../../utils/date/format-short-date";
import checkInputCurrencyValue from "../../utils/text/check-input-currency-value";
import formatCurrency from "../../utils/text/format-currency";
import formatCurrencyInput from "../../utils/text/format-currency-input";
import Input from "../input/input";
import RecurrenceDate from "../recurrence-date/recurrence-date";
import Select from "../select/select";
import TextEditor from "../text-editor/text-editor";
import styles from "./transaction-form.module.css";
import TransactionFormSubmitButton from "./transaction-form-submit-button";
import TransactionLogs from "./transaction-logs";
import TransactionTypeSelector from "./transaction-type-selector";

export interface ITransactionFormValue extends TransactionFormData {
  id: string;
}

interface ITransactionFormProps {
  actionType?: "create" | "update";
  value?: ITransaction;
  onClose: () => void;
}

const TransactionForm = ({
  actionType,
  value,
  onClose,
}: ITransactionFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: React.useMemo(
      () => ({
        ...value,
        name: value?.name ?? "",
        type: value?.type ?? "debt",
        date: value?.date ?? new Date(),
        category: value?.category ?? "debts",
        description: value?.description ?? "",
      }),
      [value],
    ) as ITransactionFormValue,
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

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const getStartDate = (): string => {
      if (!value?.date) {
        return new Date().toISOString();
      }
      return typeof value.date === "string"
        ? value.date
        : value.date.toISOString();
    };
    dispatch(
      updateRecurrence({
        startDate: getStartDate(),
        ...value?.recurrence,
      }),
    );
  }, [value, dispatch]);

  return (
    <form action="#" aria-label="Formulário de criação de transação">
      <Input
        id="name"
        type="text"
        label="Nome"
        placeholder="Nome da meta"
        maxLength={40}
        register={register("name")}
        error={errors.name?.message}
      />
      <div className={styles.transactionFormValueGroup}>
        <Input
          id="value"
          type="text"
          label="Valor (R$)"
          placeholder="0,00"
          maxLength={20}
          hasNoMargin={true}
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
          name="type"
          control={control}
          render={({ field }) => (
            <TransactionTypeSelector
              id="transaction-form-type-selector"
              label="Tipo"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <RecurrenceDate
            id="transaction-recurrence-date"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Categoria"
            id="category"
            initialTitle="Selecione uma opção"
            groups={[{ children: transactionCategoryMap }]}
            value={field.value}
            onChange={field.onChange}
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
            placeholder="Descreva sua transação brevemente"
            configType="clean"
            value={field.value}
            onChange={field.onChange}
            isRequired={false}
          />
        )}
      />

      {actionType === "update" && value?.occurrenceLog && (
        <TransactionLogs occurrenceLogs={value.occurrenceLog ?? []} />
      )}

      <TransactionFormSubmitButton
        transactionId={value?.id}
        actionType={actionType}
        loading={loading}
        setLoading={setLoading}
        handleSubmit={handleSubmit}
        reset={reset}
        onClose={onClose}
        hasAlt={!isDirty}
      />

      {actionType === "update" && (
        <p className="formWarningText">{`Atualizado em: ${formatShortDate(new Date(value!.updatedAt))}`}</p>
      )}
    </form>
  );
};

export default TransactionForm;
