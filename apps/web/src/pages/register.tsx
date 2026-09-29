import Footer from "../components/footer/footer";
import GradientBackground from "../components/gradient-background/gradient-background";
import Head from "../components/head/Head";
import RegisterForm from "../components/register-form/register-form";

const Register = () => {
  return (
    <GradientBackground>
      <Head pageTitle="Cadastro" />
      <RegisterForm />
      <Footer position="absolute" backgroundStyle="transparent" />
    </GradientBackground>
  );
};

export default Register;
