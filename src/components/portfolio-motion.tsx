"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function MotionBlock({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.8, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}

export function MotionGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="show"
      animate="show"
      whileInView="show"
      viewport={{ once: false, amount: 0.16 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.075,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 34, scale: 0.96, filter: "blur(14px)", rotateZ: -0.6 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          rotateZ: 0,
          transition: { duration: 0.72, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
