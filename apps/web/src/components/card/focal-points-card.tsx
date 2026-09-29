import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CirclePause,
  ListChecks,
  Target,
  Trophy,
} from "lucide-react";

import StatusTag from "../status-tag/status-tag";
import Card from "./card";
import styles from "./focal-points-card.module.css";

const FocalPointsCard = () => {
  return (
    <Card id="focal-points" title="Pontos focais" icon={Target}>
      <div className={styles.focalPointsCardMainContent}>
        <div className={styles.focalPointsCardCategory}>
          <p>Visão das metas</p>
          <ul className={styles.focalPointsList}>
            <li>
              <StatusTag name="Total" value="34" icon={ListChecks} />
            </li>
            <li>
              <StatusTag name="Em espera" value="6" icon={CirclePause} />
            </li>
            <li>
              <StatusTag name="Concluídas" value="3" icon={Trophy} />
            </li>
          </ul>
        </div>
        <div className={styles.focalPointsCardCategory}>
          <p>Atividades do mês</p>
          <ul
            className={`${styles.focalPointsList} ${styles.transactionsInfo}`}
          >
            <li data-type="credit">
              <BanknoteArrowUp size={14} />
              <p>
                Créditos: <span>+ R$ 7.500,00</span>
              </p>
            </li>
            <li data-type="debt">
              <BanknoteArrowDown size={14} />
              <p>
                Débito: <span>- R$ 1.200,00</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default FocalPointsCard;
