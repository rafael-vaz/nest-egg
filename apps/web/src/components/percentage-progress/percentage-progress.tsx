import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { Slider, SliderChangeEvent } from "primereact/slider";

import styles from "./percentage-progress.module.css";

interface IPercentageProgressProps {
  value: number;
  className?: string;
  onChange?: (value: number) => void;
}

const PercentageProgress = ({
  value,
  onChange,
  className = "",
}: IPercentageProgressProps) => {
  function handleChange(event: SliderChangeEvent) {
    const value = event.value as number;
    onChange?.(value);
  }

  return (
    <div
      className={`${styles.percentageProgress} ${className}`}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label="Progresso em porcentagem"
      tabIndex={0}
    >
      <Slider value={value} onChange={handleChange} />
      <span
        className={styles.percentageProgressLabel}
        role="status"
        aria-live="polite"
      >
        {`${value}%`}
      </span>
    </div>
  );
};

export default PercentageProgress;
