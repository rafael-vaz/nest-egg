import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import egg from "../../assets/img/illustrations/egg.svg";
import Button from "../button/button";
import Footer from "../footer/footer";
import GradientBackground from "../gradient-background/gradient-background";
import GradientContainer from "../gradient-container/gradient-container";
import Subtitle from "../subtitle/subtitle";
import styles from "./not-found.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <GradientContainer id="not-found">
        <div className={styles.notFound}>
          <img src={egg} alt="Ilustração de um ovo quebrado" />
          <div>
            <Subtitle text="Eita! A página sumiu..." align="center" />
            <p>
              Talvez tenha sido apagada, renomeada… ou nunca existiu. Que tal
              voltar pra home ou explorar o site?
            </p>
            <Button
              icon={ArrowLeft}
              text="Acessar página inicial"
              onClick={() => navigate("/")}
              color="green"
              size="fill"
            />
          </div>
        </div>
      </GradientContainer>
      <Footer position="absolute" backgroundStyle="transparent" />
    </GradientBackground>
  );
};

export default NotFound;
