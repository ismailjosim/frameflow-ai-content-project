import { FAQ_ITEMS, SECTION_DIVIDER } from "./landing.data";

export function LandingFaq() {
  return (
    <section id="faq" className="py-20" style={SECTION_DIVIDER}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A3FFC]">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={faq.q}
              className={`p-5 rounded-2xl space-y-2 transition-all hover:shadow-sm bg-white/80 dark:bg-slate-900/60 shadow-xs border ${
                i % 2 === 0
                  ? "border-purple-200 dark:border-[#8A3FFC]/25"
                  : "border-cyan-200 dark:border-[#58E6F7]/25"
              }`}
            >
              <h4 className="text-sm font-bold text-foreground">{faq.q}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingFaq;
