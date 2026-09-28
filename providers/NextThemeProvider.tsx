"use client";

import { ThemeProvider } from "next-themes";
import type React from "react";
import { Toaster } from "@/components/ui/sonner";

export function NextThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}

export default NextThemeProvider;
