import { ChevronDown, PlayCircle } from "lucide-react";
import React from "react";

import { useAppDispatch } from "../../store/configure-store";
import { startTutorial } from "../../store/reducers/tutorial/tutorial";
import helpFaqMap from "../../templates/help-faq-map";
import tutorialSteps from "../../templates/tutorial-steps-map";
import Button from "../button/button";
import styles from "./help.module.css";

interface IHelpFaqProps {
  onClose: () => void;
}

const HelpFaq = ({ onClose }: IHelpFaqProps) => {
  const dispatch = useAppDispatch();
  const [isDesktopViewport, setIsDesktopViewport] = React.useState(
    () => window.matchMedia("(min-width: 31.25rem)").matches,
  );

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 31.25rem)");
    const handleChange = () => setIsDesktopViewport(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  function handleStartTutorial() {
    onClose();
    dispatch(startTutorial());
  }

  return (
    <div className={styles.helpFaq}>
      <div className={styles.helpFaqHeader}>
        <h4 className={styles.helpFaqTitle}>Perguntas frequentes</h4>
        {isDesktopViewport && (
          <div className={styles.helpTutorialTrigger}>
            <Button
              icon={PlayCircle}
              color="light-gray"
              text="Tutorial"
              aria-label="Iniciar tutorial guiado"
              onClick={handleStartTutorial}
            />
            <span className={styles.helpTutorialStepCount}>
              {tutorialSteps.length} passos
            </span>
          </div>
        )}
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
