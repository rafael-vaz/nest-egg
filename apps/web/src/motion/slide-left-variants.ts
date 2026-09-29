import { Variants } from "motion/react";

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      delay: i * 0.2,
    },
  }),
};

export default slideLeftVariants;
