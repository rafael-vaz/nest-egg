import { CircleCheckBig } from "lucide-react";

import CircularProgress from "../circular-progress/circular-progress";
import Card from "./card";
import styles from "./circular-progress-card.module.css";

const GreatestProgressCollection = () => {
  return (
    <Card
      id="greatest-progress-collection"
      title="Maior desempenho"
      icon={CircleCheckBig}
    >
      <div className={styles.circularProgressCardMainContent}>
        <CircularProgress progress={90} />
        <ul className={styles.circularProgressCardInfoList}>
          <li className={styles.name}>Novos Eletrodomésticos</li>
          <li className={styles.progress}>9/10 metas concluídas</li>
          <li className={styles.time}>Faltam: R$ 2.400,00</li>
        </ul>
      </div>
      <span className={styles.circularProgressCardLastUpdate}>
        Atualizado há 2 anos
      </span>
    </Card>
  );
};

export default GreatestProgressCollection;
