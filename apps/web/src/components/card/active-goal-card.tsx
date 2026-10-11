import { CircleCheckBig } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { shouldShowAchievementModal } from "../../utils/achievement/should-show-achievement";
import calculateGoalProgress from "../../utils/goal/calculate-goal-progress";
import formatCurrency from "../../utils/text/format-currency";
import CircularProgress from "../circular-progress/circular-progress";
import ToolMenuEmptyList from "../tool-menu/tool-menu-empty-list";
import Card from "./card";
import styles from "./circular-progress-card.module.css";

const ActiveGoalCard = () => {
  const dispatch = useAppDispatch();
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { goals } = useSelector((state: RootState) => state.userFinances);
  const hasShownAchievement = React.useRef(false);

  const activeGoal = goals.find((goal) => goal.status === "active") ?? null;
  const walletValue = authUser?.wallet ?? 0;
  const progress = activeGoal
    ? calculateGoalProgress(walletValue, activeGoal.value)
    : 0;

  React.useEffect(() => {
    if (hasShownAchievement.current || !authUser?.uid || !activeGoal) return;
    if (shouldShowAchievementModal(progress, authUser.hasSeenAchievement)) {
      hasShownAchievement.current = true;
      dispatch(
        openModalState({ id: "achievement", entity: activeGoal.name }),
      );
    }
  }, [progress, activeGoal, authUser, dispatch]);

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
                {progress >= 100
                  ? "Meta concluída"
                  : `${Math.round(progress)}% concluído`}
              </li>
            </ul>
          </div>
          <Link to="/goals" className={styles.circularProgressLink}>
            {"Ver todas as metas 🡢"}
          </Link>
        </>
      ) : (
        <ToolMenuEmptyList text="Nenhuma meta ativa no momento." />
      )}
    </Card>
  );
};

export default ActiveGoalCard;
