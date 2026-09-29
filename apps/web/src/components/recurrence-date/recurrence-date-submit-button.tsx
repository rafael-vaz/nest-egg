import { Save } from "lucide-react";
import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { toast } from "react-toastify";

import {
  FrequencyCategory,
  IRecurrenceDate,
} from "../../@types/recurrence-date";
import { RecurrenceDateFormData } from "../../schemas/recurrence-date-form-schema";
import { useAppDispatch } from "../../store/configure-store";
import { setRecurrence } from "../../store/reducers/recurrence-date/recurrence-date";
import { WeekDaysId } from "../../templates/days-of-the-week-map";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";

interface IRecurrenceDateSubmitButtonProps {
  handleSubmit: UseFormHandleSubmit<RecurrenceDateFormData>;
  reset: UseFormReset<RecurrenceDateFormData>;
  onClose: () => void;
}

const RecurrenceDateSubmitButton = ({
  handleSubmit,
  onClose,
}: IRecurrenceDateSubmitButtonProps) => {
  const dispatch = useAppDispatch();

  function handleSetRecurrenceDate(data: RecurrenceDateFormData) {
    const recurrenceDate: IRecurrenceDate = {
      startDate: data.startDate.toISOString(),
      endDate: data.endDate?.toISOString() ?? null,
      frequency: {
        rate: Number(data.amount),
        category: data.timeUnit as FrequencyCategory,
        weekDays: data.frequency.weekDays as WeekDaysId[] | null,
        order: data.frequency.order,
      },
    };
    dispatch(setRecurrence(recurrenceDate));
    toast.success("Recorrência salva com sucesso!");
    onClose();
  }

  const onSubmit = async (data: RecurrenceDateFormData) => {
    handleSetRecurrenceDate(data);
  };

  const onError = createOnError<RecurrenceDateFormData>();
  return (
    <Button
      type="submit"
      size="fill"
      text="Salvar"
      icon={Save}
      color="green"
      aria-label="Salvar recorrência"
      onClick={handleSubmit(onSubmit, onError)}
    />
  );
};

export default RecurrenceDateSubmitButton;
