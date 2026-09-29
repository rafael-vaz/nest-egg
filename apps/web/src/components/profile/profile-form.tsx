import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import profileFormSchema, {
  ProfileFormData,
} from "../../schemas/profile-form-schema";
import { RootState } from "../../store/configure-store";
import checkInputCurrencyValue from "../../utils/text/check-input-currency-value";
import formatCurrency from "../../utils/text/format-currency";
import formatCurrencyInput from "../../utils/text/format-currency-input";
import DatePickerElement from "../date-picker-element/date-picker-element";
import GridContainer from "../grid-container/grid-container";
import Input from "../input/input";
import ProfileFormSubmitButton from "./profile-form-submit-button";

const ProfileForm = () => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const [loading, setLoading] = React.useState(false);
  const walletInputRef = React.useRef<HTMLInputElement | null>(null);

  const formValues = React.useMemo(
    () => ({
      name: authUser?.name ?? "",
      email: authUser?.email ?? "",
      wallet: authUser?.wallet ?? 0,
      dateOfBirth: authUser?.dateOfBirth
        ? new Date(authUser.dateOfBirth)
        : new Date(),
    }),
    [authUser?.name, authUser?.email, authUser?.wallet, authUser?.dateOfBirth],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    values: formValues,
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const reg = register("wallet", {
    required: true,
    setValueAs: checkInputCurrencyValue,
  });

  React.useEffect(() => {
    if (walletInputRef.current && authUser) {
      walletInputRef.current.value = formatCurrency(`${authUser.wallet}`);
    }
  }, [authUser]);

  return (
    <form action="#" aria-label="Formulário de perfil">
      <GridContainer columns={2}>
        <Input
          type="text"
          id="name"
          label="Nome"
          placeholder="Seu nome"
          register={register("name", { required: true })}
          error={errors.name?.message}
          hasNoMargin={true}
        />

        <Input
          type="email"
          id="email"
          label="E-mail"
          placeholder="Seu e-mail"
          register={register("email", { required: true })}
          error={errors.email?.message}
          disabled
        />
      </GridContainer>
      <GridContainer columns={2}>
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePickerElement
              id="dateOfBirth"
              label="Data de nascimento"
              value={field.value}
              onChange={field.onChange}
              hasNoMargin={true}
              error={errors.dateOfBirth?.message}
            />
          )}
        />

        <Input
          id="wallet"
          type="text"
          label="Carteira (R$)"
          placeholder="0,00"
          maxLength={20}
          onInput={formatCurrencyInput}
          register={{
            ...reg,
            ref: (el) => {
              reg.ref(el);
              walletInputRef.current = el;
            },
          }}
          error={errors.wallet?.message}
        />
      </GridContainer>
      <ProfileFormSubmitButton
        handleSubmit={handleSubmit}
        loading={loading}
        setLoading={setLoading}
        hasAlt={!isDirty}
      />
    </form>
  );
};

export default ProfileForm;
