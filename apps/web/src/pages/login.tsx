import Footer from "../components/footer/footer";
import GradientBackground from "../components/gradient-background/gradient-background";
import Head from "../components/head/Head";
import LoginForm from "../components/login-form/login-form";

const Login = () => {
  return (
    <GradientBackground>
      <Head pageTitle="Login" />
      <LoginForm />
      <Footer position="absolute" backgroundStyle="transparent" />
    </GradientBackground>
  );
};

export default Login;
