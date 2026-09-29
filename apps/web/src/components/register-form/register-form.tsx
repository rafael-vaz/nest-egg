import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import registerFormSchema, {
  RegisterFormData,
} from "../../schemas/register-form-schema";
import DatePickerElement from "../date-picker-element/date-picker-element";
import GradientContainer from "../gradient-container/gradient-container";
import Input from "../input/input";
import Title from "../title/title";
import styles from "./register-form.module.css";
import RegisterSubmitButton from "./register-submit-button";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });
  const [loading, setLoading] = React.useState(false);

  return (
    <GradientContainer id="register-form">
      <form
        action="#"
        className={styles.registerForm}
        aria-label="Formulário de cadastro"
      >
        <Title text="Cadastro" align="center" />
        <p>Preencha as informações abaixo para concluir o cadastro.</p>
        <Input
          id="name"
          type="text"
          label="Nome"
          placeholder="Seu nome completo"
          register={register("name", { required: true })}
          error={errors.name?.message}
        />
        <Input
          id="email"
          type="text"
          label="E-mail"
          placeholder="Seu e-mail"
          register={register("email", { required: true })}
          error={errors.email?.message}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePickerElement
              id="dateOfBirth"
              label="Data de nascimento"
              value={field.value}
              onChange={field.onChange}
              error={errors.dateOfBirth?.message}
            />
          )}
        />
        <Input
          id="password"
          type="password"
          label="Senha"
          placeholder="Sua senha"
          hasVisibilityToggle={true}
          register={register("password", { required: true })}
          error={errors.password?.message}
        />
        <Input
          id="confirm-password"
          type="password"
          label="Confirme sua senha"
          placeholder="Repita a senha acima"
          hasVisibilityToggle={true}
          register={register("confirmPassword", { required: true })}
          error={errors.confirmPassword?.message}
        />
        <RegisterSubmitButton
          loading={loading}
          setLoading={setLoading}
          handleSubmit={handleSubmit}
          reset={reset}
        />
        <p className={styles.loginInvite}>
          Já possui uma conta?{" "}
          <Link to="/login" tabIndex={0} className={loading ? "disabled" : ""}>
            Acessar
          </Link>
        </p>
      </form>
    </GradientContainer>
  );
};

export default RegisterForm;
