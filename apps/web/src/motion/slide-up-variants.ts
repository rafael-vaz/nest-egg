import { Variants } from "motion/react";

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      delay: i * 0.2,
    },
  }),
};

export default slideUpVariants;
