import { useNavigate } from "react-router-dom";

import Button from "../button/button";
import Title from "../title/title";
import styles from "./achievement.module.css";
import AchievementConfetti from "./achievement-confetti";

interface IAchievementProps {
  goalName?: string;
  onClose: () => void;
}

const Achievement = ({ goalName, onClose }: IAchievementProps) => {
  const navigate = useNavigate();

  function handleClick() {
    onClose();
    navigate("/goals");
  }

  return (
    <div className={styles.achievement}>
      <AchievementConfetti />
      <Title text="Parabéns pela conquista! 🎉" align="center" />
      <p className={styles.achievementMessage}>
        {goalName ? (
          <>
            Você atingiu 100% da sua meta <b>{goalName}</b>! 🏆
          </>
        ) : (
          <>Você atingiu 100% da sua meta ativa! 🏆</>
        )}
      </p>
      <p className={styles.achievementMessage}>
        Cada conquista é um passo a mais rumo aos seus objetivos financeiros.
        Que tal começar um novo desafio? Ative sua próxima meta e continue
        avançando!
      </p>
      <div className={styles.achievementActions}>
        <Button
          text="Ativar próxima meta"
          color="purple"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default Achievement;
