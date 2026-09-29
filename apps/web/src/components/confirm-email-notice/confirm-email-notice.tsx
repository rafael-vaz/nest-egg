import React from "react";

import GradientContainer from "../gradient-container/gradient-container";
import LoaderBox from "../loader/loader-box";
import Title from "../title/title";
import styles from "./confirm-email-notice.module.css";
import ConfirmEmailNoticeButton from "./confirm-email-notice-button";
import { ResendEmailNoticeButton } from "./resend-email-notice-button";

const ConfirmEmailNotice = () => {
  const [checkingEmail, setCheckingEmail] = React.useState(false);
  const [resendingEmail, setResendingEmail] = React.useState(false);

  return (
    <GradientContainer id="confirm-email">
      <div
        className={`${styles.confirmEmailNotice} noVisualFocus`}
        tabIndex={0}
      >
        <Title text="Confirme o seu e-mail" align="center" />
        <p>
          <b>
            Acabamos de enviar um e-mail de confirmação para você no endereço
            fe*******@live.com.
          </b>
        </p>
        <p className={styles.warning}>
          Fique atento à sua caixa de entrada e lembre-se de verificar o spam e
          a lixeira.
        </p>
        <LoaderBox text="Aguardando confirmação..." />
        <div className={styles.confirmEmailNoticeButtons}>
          <ConfirmEmailNoticeButton
            loading={checkingEmail}
            setLoading={setCheckingEmail}
          />
          <ResendEmailNoticeButton
            loading={resendingEmail}
            setLoading={setResendingEmail}
          />
        </div>
      </div>
    </GradientContainer>
  );
};

export default ConfirmEmailNotice;
