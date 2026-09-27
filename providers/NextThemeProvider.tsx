"use client";

import { ThemeProvider } from "next-themes";
import type React from "react";

export function NextThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}

export default NextThemeProvider;
