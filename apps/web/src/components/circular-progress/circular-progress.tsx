import "react-circular-progressbar/dist/styles.css";

import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

import styles from "./circular-progress.module.css";

interface ICircularProgress {
  progress: number;
}

const CircularProgress = ({ progress }: ICircularProgress) => {
  return (
    <div aria-label="Progresso" className={styles.circularProgress}>
      <CircularProgressbar
        value={progress}
        minValue={0}
        maxValue={100}
        text={`${progress}%`}
        strokeWidth={6}
        background
        styles={buildStyles({
          strokeLinecap: "round",
          pathTransitionDuration: 0.5,
          pathColor: `#15f5ba`,
          textColor: "#dedde9",
          trailColor: "#212121",
          textSize: "24px",
          backgroundColor: "#212121",
        })}
      />
    </div>
  );
};

export default CircularProgress;
