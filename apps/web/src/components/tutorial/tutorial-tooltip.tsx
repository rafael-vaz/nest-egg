import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { TooltipRenderProps } from "react-joyride";

import styles from "./tutorial-tooltip.module.css";

const TutorialTooltip = ({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  step,
  tooltipProps,
}: TooltipRenderProps) => {
  return (
    <div {...tooltipProps} className={styles.tutorialTooltip}>
      <button {...closeProps} className={styles.tutorialTooltipClose}>
        <X size={16} />
      </button>
      {step.title && (
        <h3 className={styles.tutorialTooltipTitle}>{step.title}</h3>
      )}
      <div className={styles.tutorialTooltipContent}>{step.content}</div>
      <div className={styles.tutorialTooltipFooter}>
        {index > 0 ? (
          <button {...backProps} className={styles.tutorialTooltipNavButton}>
            <ArrowLeft size={16} />
          </button>
        ) : (
          <span className={styles.tutorialTooltipNavButton} />
        )}
        <span className={styles.tutorialTooltipCounter}>
          {index + 1} de {size}
        </span>
        <button
          {...primaryProps}
          className={`${styles.tutorialTooltipNavButton} ${styles.tutorialTooltipNavButtonPrimary}`}
        >
          {isLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default TutorialTooltip;
