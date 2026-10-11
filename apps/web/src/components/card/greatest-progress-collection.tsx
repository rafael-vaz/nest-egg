import { CircleCheckBig } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import findGreatestProgressCollection from "../../utils/collection/find-greatest-progress-collection";
import formatRelativeDate from "../../utils/date/format-relative-date";
import formatCurrency from "../../utils/text/format-currency";
import CircularProgress from "../circular-progress/circular-progress";
import ToolMenuEmptyList from "../tool-menu/tool-menu-empty-list";
import Card from "./card";
import styles from "./circular-progress-card.module.css";

const GreatestProgressCollection = () => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { collections, goals } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const walletValue = authUser?.wallet ?? 0;

  const best = findGreatestProgressCollection(collections, goals, walletValue);

  return (
    <Card
      id="greatest-progress-collection"
      title="Maior desempenho"
      icon={CircleCheckBig}
    >
      {best ? (
        <>
          <div className={styles.circularProgressCardMainContent}>
            <CircularProgress
              progress={Math.round((best.completedCount / best.totalCount) * 100)}
            />
            <ul className={styles.circularProgressCardInfoList}>
              <li className={styles.name}>{best.collection.name}</li>
              <li className={styles.progress}>
                {best.completedCount}/{best.totalCount} metas concluídas
              </li>
              <li className={styles.time}>
                Faltam: {formatCurrency(`${best.remaining}`)}
              </li>
            </ul>
          </div>
          <span className={styles.circularProgressCardLastUpdate}>
            Atualizado{" "}
            {formatRelativeDate(new Date(best.collection.updatedAt))}
          </span>
        </>
      ) : (
        <ToolMenuEmptyList text="Nenhuma coleção com metas no momento." />
      )}
    </Card>
  );
};

export default GreatestProgressCollection;
