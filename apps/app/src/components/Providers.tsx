"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { ContactDialogProvider } from "./ContactDialogProvider";
import { LazyMotion, domAnimation } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LazyMotion features={domAnimation} strict>
        <ContactDialogProvider>{children}</ContactDialogProvider>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default Providers;
