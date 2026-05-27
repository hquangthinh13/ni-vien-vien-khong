"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function MotionWrapper({
  children,
  delay = 0.2,
  className = "",
}: Props) {
  return (
    <motion.div
      // initial={{ opacity: 0, y: 5 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // transition={{
      //   duration: 1.3,
      //   delay,
      //   ease: [0.22, 1, 0.36, 1],
      // }}
      // viewport={{ amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
