"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { InteractiveSlideshow } from "./InteractiveSlideshow";
import { LandingComparison } from "./LandingComparison";
import { LandingCta } from "./LandingCta";
import { LandingFaq } from "./LandingFaq";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";
import { LandingNav } from "./LandingNav";
import { LandingPipeline } from "./LandingPipeline";
import { LandingPresets } from "./LandingPresets";
import { LandingSecurity } from "./LandingSecurity";

export function LandingPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [activePipelineTab, setActivePipelineTab] = useState<number>(1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[#E51FD1]/30 selection:text-[#58E6F7] transition-colors duration-200">
      <LandingNav user={user} />
      <LandingHero
        user={user}
        activePipelineTab={activePipelineTab}
        onTabChange={setActivePipelineTab}
      />
      <InteractiveSlideshow />
      <LandingPipeline />
      <LandingPresets />
      <LandingSecurity />
      <LandingComparison />
      <LandingFaq />
      <LandingCta user={user} />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
