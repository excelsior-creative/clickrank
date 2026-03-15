"use client";

import { m } from "framer-motion";
import React from "react";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export const SectionReveal = ({ children, className, delay = 0 }: SectionRevealProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {children}
    </m.div>
  );
};
