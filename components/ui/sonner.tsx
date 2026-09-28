"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/95 dark:group-[.toaster]:bg-slate-900/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-slate-100 group-[.toaster]:border-slate-200/80 dark:group-[.toaster]:border-slate-800/80 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:text-xs font-sans",
          description:
            "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400 text-[11px]",
          actionButton:
            "group-[.toast]:bg-[#8A3FFC] group-[.toast]:text-white font-medium text-xs rounded-xl",
          cancelButton:
            "group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-800 group-[.toast]:text-slate-600 dark:group-[.toast]:text-slate-300 text-xs rounded-xl",
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
