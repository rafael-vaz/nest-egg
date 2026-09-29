import Footer from "../components/footer/footer";
import GradientBackground from "../components/gradient-background/gradient-background";
import Head from "../components/head/Head";
import RecoveryPasswordForm from "../components/recovery-password-form/recovery-password-form";

const RecoveryPassword = () => {
  return (
    <GradientBackground>
      <Head pageTitle="Recuperar senha" />
      <RecoveryPasswordForm />
      <Footer position="absolute" backgroundStyle="transparent" />
    </GradientBackground>
  );
};

export default RecoveryPassword;
