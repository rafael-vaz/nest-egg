import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import ConfirmEmailNotice from "../components/confirm-email-notice/confirm-email-notice";
import Footer from "../components/footer/footer";
import GradientBackground from "../components/gradient-background/gradient-background";
import Head from "../components/head/Head";
import { RootState } from "../store/configure-store";

const ConfirmEmail = () => {
  const { auth, authUser } = useSelector((state: RootState) => state.userAuth);
  const hasPendingEmailConfirmation = auth && !authUser?.emailVerified;
  return hasPendingEmailConfirmation ? (
    <GradientBackground>
      <Head pageTitle="Confirmação de e-mail" />
      <ConfirmEmailNotice />
      <Footer position="absolute" backgroundStyle="transparent" />
    </GradientBackground>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ConfirmEmail;
