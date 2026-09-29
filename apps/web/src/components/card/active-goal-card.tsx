import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

import CircularProgress from "../circular-progress/circular-progress";
import Card from "./card";
import styles from "./circular-progress-card.module.css";

const ActiveGoalCard = () => {
  return (
    <Card id="active-goal" title="Meta ativa" icon={CircleCheckBig}>
      <div className={styles.circularProgressCardMainContent}>
        <CircularProgress progress={50} />
        <ul className={styles.circularProgressCardInfoList}>
          <li className={styles.name}>Casa nova</li>
          <li className={styles.progress}>
            <span className="visuallyHidden">
              R$ 100.500,00 de R$ 350.000,00
            </span>
            <span aria-hidden={true}>R$ 100.500,00 / 350.000,00</span>
          </li>
          <li>Prazo estimado: 2 anos 3 meses</li>
        </ul>
      </div>
      <Link to="/goals" className={styles.circularProgressLink}>
        {"Ver todas as metas 🡢"}
      </Link>
    </Card>
  );
};

export default ActiveGoalCard;
