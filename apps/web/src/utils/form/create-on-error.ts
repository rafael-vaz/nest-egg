import { FieldValues, SubmitErrorHandler } from "react-hook-form";

function createOnError<T extends FieldValues>() {
  const onError: SubmitErrorHandler<T> = (errors) => {
    const mappedErros = Object.entries(errors).map(([key, value]) => {
      return {
        key: key as keyof typeof errors,
        value: value?.message,
      };
    });
    console.log("Fields with validation errors:");
    console.log(mappedErros);
  };
  return onError;
}

export default createOnError;
