import { motion } from "motion/react";
import React from "react";

import styles from "./achievement.module.css";

const CONFETTI_COLORS = [
  "var(--ne-c11)",
  "var(--ne-c12)",
  "var(--alert)",
  "var(--info)",
  "var(--ne-c2)",
];

interface IConfettiPiece {
  id: number;
  left: number;
  color: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
  rotation: number;
}

function createConfettiPieces(count: number): IConfettiPiece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    width: 6 + Math.random() * 5,
    height: 10 + Math.random() * 6,
    delay: Math.random() * 0.6,
    duration: 1.8 + Math.random() * 1.2,
    rotation: Math.random() * 360,
  }));
}

const AchievementConfetti = () => {
  const pieces = React.useMemo(() => createConfettiPieces(28), []);

  return (
    <div className={styles.achievementConfetti} aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className={styles.achievementConfettiPiece}
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: 320,
            opacity: [0, 1, 1, 0],
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
};

export default AchievementConfetti;
