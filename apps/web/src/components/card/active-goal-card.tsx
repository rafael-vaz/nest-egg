import { CircleCheckBig } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { updateGoalThunk } from "../../store/thunks/goal/goal-data";
import calculateGoalProgress from "../../utils/goal/calculate-goal-progress";
import formatCurrency from "../../utils/text/format-currency";
import CircularProgress from "../circular-progress/circular-progress";
import ToolMenuEmptyList from "../tool-menu/tool-menu-empty-list";
import activeGoalCardStyle from "./active-goal-card.module.css";
import Card from "./card";
import styles from "./circular-progress-card.module.css";

const ActiveGoalCard = () => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { goals } = useSelector((state: RootState) => state.userFinances);

  const activeGoal = goals.find((goal) => goal.status === "active") ?? null;
  const walletValue = authUser?.wallet ?? 0;
  const progress = activeGoal
    ? calculateGoalProgress(walletValue, activeGoal.value)
    : 0;

  async function handleMarkAsCompleted() {
    if (!authUser?.uid || !activeGoal) return;
    try {
      await dispatch(
        updateGoalThunk({
          userId: authUser.uid,
          goal: { id: activeGoal.id, status: "completed" },
          hasAlert: false,
        }),
      ).unwrap();
      dispatch(openModalState({ id: "achievement", entity: activeGoal.name }));
    } catch {
      // updateGoalThunk already surfaces the error via its own alert/toast
    }
  }

  return (
    <Card id="active-goal" title="Meta ativa" icon={CircleCheckBig}>
      {activeGoal ? (
        <>
          <div className={styles.circularProgressCardMainContent}>
            <CircularProgress progress={Math.round(progress)} />
            <ul className={styles.circularProgressCardInfoList}>
              <li className={styles.name}>{activeGoal.name}</li>
              <li className={styles.progress}>
                <span className="visuallyHidden">
                  {formatCurrency(`${walletValue}`)} de{" "}
                  {formatCurrency(`${activeGoal.value}`)}
                </span>
                <span aria-hidden={true}>
                  {formatCurrency(`${walletValue}`)} /{" "}
                  {formatCurrency(`${activeGoal.value}`)}
                </span>
              </li>
              <li>
                {progress >= 100 ? (
                  <button
                    type="button"
                    className={activeGoalCardStyle.markAsCompletedButton}
                    onClick={handleMarkAsCompleted}
                  >
                    Marcar como concluída
                  </button>
                ) : (
                  `${Math.round(progress)}% concluído`
                )}
              </li>
            </ul>
          </div>
          <Link to="/goals" className={styles.circularProgressLink}>
            {"Ver todas as metas 🡢"}
          </Link>
        </>
      ) : (
        <div className={activeGoalCardStyle.emptyActiveGoal}>
          <p>
            Acesse sua <Link to="/goals">lista de metas</Link> e selecione ou
            crie uma nova meta para ativar.
          </p>
          <ToolMenuEmptyList text="Nenhuma meta ativa no momento." />
        </div>
      )}
    </Card>
  );
};

export default ActiveGoalCard;
