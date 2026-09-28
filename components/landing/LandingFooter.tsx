import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, SECTION_DIVIDER } from "./landing.data";

export function LandingFooter() {
  return (
    <footer
      className="py-12 bg-background transition-colors"
      style={SECTION_DIVIDER}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg p-[1.5px] bg-frameflow-gradient shrink-0">
            <div className="w-full h-full rounded-md bg-slate-950 flex items-center justify-center p-0.5">
              <Image
                src="/apple-touch-icon.png"
                alt="FrameFlow Logo"
                width={24}
                height={24}
                className="rounded-xs object-contain"
              />
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground">FrameFlow Studio</p>
            <p className="text-[11px] text-muted-foreground">
              Imagine. Generate. Create.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-medium">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="text-[#8A3FFC] dark:text-[#58E6F7] hover:underline font-bold"
          >
            Studio Dashboard
          </Link>
        </div>

        <div className="text-center md:text-right">
          <p className="font-semibold text-frameflow-gradient">
            From Idea to Video, All in One Flow.
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            © {new Date().getFullYear()} FrameFlow Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
