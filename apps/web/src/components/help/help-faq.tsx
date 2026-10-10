import { ChevronDown, PlayCircle } from "lucide-react";

import { useAppDispatch } from "../../store/configure-store";
import { startTutorial } from "../../store/reducers/tutorial/tutorial";
import helpFaqMap from "../../templates/help-faq-map";
import Button from "../button/button";
import styles from "./help.module.css";

interface IHelpFaqProps {
  onClose: () => void;
}

const HelpFaq = ({ onClose }: IHelpFaqProps) => {
  const dispatch = useAppDispatch();

  function handleStartTutorial() {
    onClose();
    dispatch(startTutorial());
  }

  return (
    <div className={styles.helpFaq}>
      <div className={styles.helpFaqHeader}>
        <h4 className={styles.helpFaqTitle}>Perguntas frequentes</h4>
        <Button
          icon={PlayCircle}
          color="purple"
          text="Tutorial"
          aria-label="Iniciar tutorial guiado"
          onClick={handleStartTutorial}
        />
      </div>
      <ul className={styles.helpFaqList}>
        {helpFaqMap.map(({ id, question, answer }) => (
          <li key={id}>
            <details className={styles.helpFaqItem}>
              <summary className={styles.helpFaqSummary}>
                <span>{question}</span>
                <ChevronDown size={16} className={styles.helpFaqChevron} />
              </summary>
              <p className={styles.helpFaqAnswer}>{answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HelpFaq;
