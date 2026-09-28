// ─── Landing page static data ────────────────────────────────────────────────
// Edit copy, colors, and feature lists here — components stay clean.

export const NAV_LINKS = [
  { href: "#interactive-tour", label: "Studio Tour" },
  { href: "#pipeline", label: "4-Stage Pipeline" },
  { href: "#features", label: "Features" },
  { href: "#presets", label: "Style Presets" },
  { href: "#security", label: "Key Vault" },
  { href: "#faq", label: "FAQ" },
] as const;

export const FEATURE_TICKERS = [
  {
    icon: "zap" as const,
    color: "#58E6F7",
    glow: "rgba(88,230,247,0.12)",
    border: "rgba(88,230,247,0.2)",
    label: "Algorithmic Topic Scorer",
    desc: "5 retention angles analyzed with YouTube CTR virality formulas.",
  },
  {
    icon: "film" as const,
    color: "#8A3FFC",
    glow: "rgba(138,63,252,0.12)",
    border: "rgba(138,63,252,0.2)",
    label: "<90-Char Narration",
    desc: "Paced sentences optimized for voiceover duration and retention.",
  },
  {
    icon: "palette" as const,
    color: "#E51FD1",
    glow: "rgba(229,31,209,0.12)",
    border: "rgba(229,31,209,0.2)",
    label: "HomoDoodle Consistency",
    desc: "Flat solid colors, slate grey tunic, bold black marker lines.",
  },
  {
    icon: "archive" as const,
    color: "#FF7A32",
    glow: "rgba(255,122,50,0.12)",
    border: "rgba(255,122,50,0.2)",
    label: "1-Click ZIP Packaging",
    desc: "Instant bundle containing scripts, prompt lists, and metadata.",
  },
] as const;

export const PIPELINE_STAGES = [
  {
    num: "1",
    title: "Stage 1: Algorithmic Topic Exploration",
    sub: "High CTR hooks & virality prioritization",
    body: 'Feed in a raw curiosity keyword (e.g. "teeth rotting in ice age"), and FrameFlow generates 5 distinct psychological hooks. Each is scored for virality, curiosity gap, and thumbnail explorability with a smart exclusion engine.',
    tags: [
      "✓ Priority Ranking",
      "✓ Thumbnail Rationale",
      "✓ Duplicate Exclusion",
    ],
    accent: "#58E6F7",
    glow: "rgba(88,230,247,0.08)",
    border: "rgba(88,230,247,0.18)",
    hover: "rgba(88,230,247,0.14)",
  },
  {
    num: "2",
    title: "Stage 2: 90-Char Narration Scriptwriter",
    sub: "Paced for YouTube retention & zero fluff",
    body: "Produces conversational, high-tempo narration strictly formatted under 90 characters per sentence. Perfectly sized for human speech pacing (135 WPM), captions, and instant synchronisation with ElevenLabs voice clones.",
    tags: [
      "✓ Strict 90-Char Counter",
      "✓ 135 WPM Audio Estimator",
      "✓ Direct .txt Download",
    ],
    accent: "#8A3FFC",
    glow: "rgba(138,63,252,0.08)",
    border: "rgba(138,63,252,0.18)",
    hover: "rgba(138,63,252,0.14)",
  },
  {
    num: "3",
    title: "Stage 3: Auto-Chunking Batch Prompts",
    sub: "Midjourney & Flux prompt formulation",
    body: "Splits long scripts into automated batches of 20 scenes, preventing LLM memory dilution. Injects strict visual negative constraints (no gradients, no 3D, no photorealism) and exact hex backgrounds for scene-to-scene character consistency.",
    tags: [
      "✓ 20-Scene Auto-Chunking",
      "✓ 16:9 & 9:16 Ratio Support",
      "✓ Copy All / Single Action",
    ],
    accent: "#E51FD1",
    glow: "rgba(229,31,209,0.08)",
    border: "rgba(229,31,209,0.18)",
    hover: "rgba(229,31,209,0.14)",
  },
  {
    num: "4",
    title: "Stage 4: Automated Packaging & ZIP Export",
    sub: "Production kit ready for Premiere, CapCut & YouTube",
    body: "Generates high-CTR video titles, a curiosity-driven video description, 15 targeted hashtags, and 35 SEO tags. With a single click, bundle everything into a compressed ZIP file organised with clean filenames.",
    tags: [
      "✓ Viral Titles & SEO Tags",
      "✓ Full .ZIP File Bundler",
      "✓ Instant Copy Utilities",
    ],
    accent: "#FF7A32",
    glow: "rgba(255,122,50,0.08)",
    border: "rgba(255,122,50,0.18)",
    hover: "rgba(255,122,50,0.14)",
  },
] as const;

export const STYLE_PRESETS = [
  {
    badge: "Default",
    badgeColor: "#8A3FFC",
    title: "HomoDoodle Classic",
    desc: "Hand-drawn 2D cartoon stickman in slate grey tunic, bold black marker outlines, flat solid colors, no 3D, no photorealism.",
    meta: "Aspect: 16:9 • Midjourney v6.1",
    accent: "#8A3FFC",
    glow: "rgba(138,63,252,0.08)",
    border: "rgba(138,63,252,0.2)",
  },
  {
    badge: "Style Preset",
    badgeColor: "#58E6F7",
    title: "Cyberpunk Stickman",
    desc: "Dark synthwave city backgrounds, neon cyan and magenta outlines, high-contrast futuristic stick figures with holographic HUDs.",
    meta: "Aspect: 16:9 • Flux Schnell",
    accent: "#58E6F7",
    glow: "rgba(88,230,247,0.06)",
    border: "rgba(88,230,247,0.18)",
  },
  {
    badge: "Style Preset",
    badgeColor: "#E51FD1",
    title: "Vintage Blackboard",
    desc: "Chalkboard texture, white and pastel chalk dust lines, educational math diagrams and historical classroom explainer aesthetic.",
    meta: "Aspect: 16:9 • Midjourney v6.1",
    accent: "#E51FD1",
    glow: "rgba(229,31,209,0.06)",
    border: "rgba(229,31,209,0.18)",
  },
  {
    badge: "Customizable",
    badgeColor: "#FF7A32",
    title: "Custom Style Uploader",
    desc: "Paste your custom prompt guidelines or upload markdown files. Full control to delete, rename, and manage your preset library.",
    meta: "Any Aspect Ratio • Any Model",
    accent: "#FF7A32",
    glow: "rgba(255,122,50,0.06)",
    border: "rgba(255,122,50,0.18)",
  },
] as const;

export const SECURITY_FEATURES = [
  {
    icon: "lock" as const,
    accent: "#8A3FFC",
    title: "AES-256-GCM Encryption",
    desc: "Credentials are encrypted with authenticated AES-256-GCM at rest in MongoDB. Keys are masked in all client responses (••••••••).",
  },
  {
    icon: "cpu" as const,
    accent: "#E51FD1",
    title: "Zero Leak Memory Lifecycle",
    desc: "Keys are decrypted solely in server memory for the exact duration of prompt generation, then immediately garbage collected.",
  },
  {
    icon: "shield" as const,
    accent: "#58E6F7",
    title: "Multi-Model Auto Fallback",
    desc: "Supports Google Gemini 2.5 Flash, Anthropic Claude 3.7 Sonnet, and OpenAI GPT-4o. If one hits rate limits, auto-fallback kicks in.",
  },
] as const;

export const COMPARISON_MANUAL = [
  "Guessing topic virality on Reddit without data-driven CTR scoring.",
  "Rewriting narration manually to trim sentences under 90 characters for TTS.",
  "Copying and pasting 50 Midjourney prompts one by one into Discord.",
  "Inconsistent character faces and random 3D styles ruining stickman aesthetics.",
  "Manual folder management and zipping up assets across multiple hard drives.",
] as const;

export const COMPARISON_FRAMEFLOW = [
  "Algorithmic topic ranking with virality score, conflict, and thumbnail concepts.",
  "Strict <90-character narration scriptwriter with voiceover pacing estimation.",
  "Batch auto-chunking (20 prompts/run) formulated for Midjourney & Flux.",
  "Guaranteed HomoDoodle character consistency with negative constraints.",
  "1-Click ZIP production bundle with scripts, prompts, SEO, and packaging.",
] as const;

export const FAQ_ITEMS = [
  {
    q: "What is the 90-character rule in Stage 2?",
    a: "In high-retention 2D stickman documentaries, fast-paced voiceover requires narration sentences kept strictly under 90 characters. This ensures each scene changes every 2 to 3 seconds, keeping viewer attention locked.",
  },
  {
    q: "How does the 1-Click ZIP export work?",
    a: 'When you click "Export Full Video Bundle (.zip)" in Stage 4, client-side JSZip packages your clean narration script, scene-by-scene prompt list, viral titles, description, hashtags, and JSON project metadata into a single zip file ready for your video editor.',
  },
  {
    q: "Is my API key safe?",
    a: "Yes. Keys are encrypted using military-grade AES-256-GCM with a unique initialisation vector per key. The unencrypted key is never sent to the client browser and is decrypted solely in server memory during API calls.",
  },
  {
    q: "Can I customise or delete style presets?",
    a: "Absolutely. The Preset Studio allows you to create custom visual styles, change camera angles, tweak negative prompts, or delete custom presets whenever you wish.",
  },
] as const;

export const FOOTER_LINKS = [
  { href: "#pipeline", label: "Pipeline" },
  { href: "#features", label: "Features" },
  { href: "#presets", label: "Presets" },
  { href: "#security", label: "Security" },
] as const;

export const SECTION_DIVIDER = {
  borderTop: "1px solid var(--border)",
} as const;
