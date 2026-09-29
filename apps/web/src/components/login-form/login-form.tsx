import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { LoginFormData } from "../../schemas/login-form-schema";
import loginFormSchema from "../../schemas/login-form-schema";
import GradientContainer from "../gradient-container/gradient-container";
import Input from "../input/input";
import Logo from "../logo/logo";
import styles from "./login-form.module.css";
import LoginSubmitButton from "./login-submit-button";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });
  const [loading, setLoading] = React.useState(false);

  return (
    <GradientContainer id="login-form">
      <form
        action="#"
        className={styles.loginForm}
        aria-label="Formulário de login"
      >
        <Logo />
        <p>Planeje suas finanças e alcance seus objetivos.</p>
        <Input
          type="email"
          id="email"
          label="E-mail"
          placeholder="Seu e-mail"
          register={register("email", { required: true })}
          error={errors.email?.message}
        />
        <div className={styles.passwordContainer}>
          <Input
            type="password"
            id="password"
            label="Senha"
            placeholder="Sua senha"
            hasNoMargin={true}
            hasVisibilityToggle={true}
            register={register("password", { required: true })}
            error={errors.password?.message}
          />
          <Link
            to={"/recovery-password"}
            tabIndex={0}
            className={`${styles.lostPassword} ${loading ? "disabled" : ""}`}
          >
            Esqueci minha senha
          </Link>
        </div>
        <LoginSubmitButton
          loading={loading}
          setLoading={setLoading}
          handleSubmit={handleSubmit}
        />
        <p className={styles.registerInvite}>
          Ainda não possui uma conta?{" "}
          <Link
            to="/register"
            tabIndex={0}
            className={loading ? "disabled" : ""}
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </GradientContainer>
  );
};

export default LoginForm;
