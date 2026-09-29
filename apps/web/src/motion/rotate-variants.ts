import { Variants } from "motion/react";

const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 0.3,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export default rotateVariants;
