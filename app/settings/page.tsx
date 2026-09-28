import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsClient } from "@/components/settings";

export const metadata: Metadata = {
  title: "API Key Vault & Security - FrameFlow",
  description:
    "Manage encrypted API keys for Google Gemini, Anthropic Claude, and OpenAI with secure, private cloud encryption.",
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#58E6F7]" />
          <span>Opening Key Vault...</span>
        </div>
      }
    >
      <SettingsClient />
    </Suspense>
  );
}
