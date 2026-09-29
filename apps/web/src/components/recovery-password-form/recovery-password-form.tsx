import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import recoveryPasswordFormSchema, {
  RecoveryPasswordFormData,
} from "../../schemas/recovery-password-form";
import Button from "../button/button";
import GradientContainer from "../gradient-container/gradient-container";
import Input from "../input/input";
import Title from "../title/title";
import styles from "./recovery-password-form.module.css";
import RecoveryPasswordSubmitButton from "./recovery-password-submit-button";

const RecoveryPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryPasswordFormData>({
    resolver: zodResolver(recoveryPasswordFormSchema),
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  return (
    <GradientContainer id="recovery-password-form">
      <form
        action="#"
        className={styles.recoveryPasswordForm}
        aria-label="Formulário de recuperação de senha"
      >
        <Title text="Recuperar senha" />
        <p>
          Informe seu e-mail e enviaremos um link para você redefinir sua senha.
        </p>
        <Input
          type="email"
          id="email"
          label="E-mail"
          placeholder="Seu e-mail"
          register={register("email", { required: true })}
          error={errors.email?.message}
        />
        <div className={styles.recoveryPasswordFormButtons}>
          <RecoveryPasswordSubmitButton
            loading={loading}
            setLoading={setLoading}
            handleSubmit={handleSubmit}
          />
          <Button
            icon={MoveLeft}
            color="dark-gray"
            aria-label="Voltar para a tela de login"
            text="Voltar para a tela de login"
            size="fill"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login", { replace: true });
            }}
          />
        </div>
      </form>
    </GradientContainer>
  );
};

export default RecoveryPasswordForm;
