export interface SlideFeature {
  id: string;
  title: string;
  description: string;
  metric: string;
}

export interface Hotspot {
  x: number; // percentage from left
  y: number; // percentage from top
  label: string;
  detail: string;
}

export interface SlideData {
  id: number;
  stepNumber: string;
  badge: string;
  badgeColor: "purple" | "cyan" | "pink" | "amber" | "emerald";
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  useImageBackground?: boolean; // Set to true to use full-bleed image background with glassmorphic text overlay
  features: SlideFeature[];
  hotspots: Hotspot[];
  stats: { label: string; value: string; change?: string }[];
  ctaText: string;
  ctaHref: string;
}

export const SLIDES_DATA: SlideData[] = [
  {
    id: 1,
    stepNumber: "01",
    badge: "End-to-End Pipeline",
    badgeColor: "purple",
    title: "Complete Autonomous",
    highlightText: "Video Pipeline",
    subtitle: "From Raw Topic to Multi-Platform Viral Release",
    description:
      "Witness the full holographic flow: an initial creative thought cascades through real-time scriptwriting, acoustic waveform timing, batch visual generation, and multi-format viral packaging.",
    imageSrc: "/slide-1.jpg",
    imageAlt: "FrameFlow Studio End-to-End 3D Video Production Pipeline",
    features: [
      {
        id: "f1-1",
        title: "Holistic 5-Stage Orchestration",
        description:
          "Zero context loss between brainstorming, timeline cuts, prompt generation, and export.",
        metric: "5 Unified Stages",
      },
      {
        id: "f1-2",
        title: "Multi-Platform Syndication",
        description:
          "Instantly format and preview native aspect ratios for YouTube Shorts, TikTok, and Instagram Reels.",
        metric: "3 Platforms at Once",
      },
      {
        id: "f1-3",
        title: "Autonomous Asset Synthesis",
        description:
          "All video cuts, narration stems, audio waveforms, and cover art are synchronized on a unified timeline.",
        metric: "100% Automated Flow",
      },
    ],
    hotspots: [
      {
        x: 11,
        y: 46,
        label: "Topic Genesis",
        detail: "Initial creative idea distilled with viral audience hooks",
      },
      {
        x: 38,
        y: 46,
        label: "Acoustic Timeline",
        detail: "Audio waveform beat synchronization and rhythmic cut points",
      },
      {
        x: 83,
        y: 46,
        label: "Viral Ready Player",
        detail:
          "Multi-channel packaging ready for instant YouTube & TikTok release",
      },
    ],
    stats: [
      { label: "Pipeline Duration", value: "32s Video", change: "Fast" },
      { label: "Projected Views", value: "248K+", change: "+180%" },
      { label: "Platforms Supported", value: "YT / TT / IG", change: "Native" },
    ],
    ctaText: "Launch 4-Stage Pipeline",
    ctaHref: "/dashboard",
  },
  {
    id: 2,
    stepNumber: "02",
    badge: "Stage 1 & 2 • Script & Timing",
    badgeColor: "cyan",
    title: "Viral Scripting &",
    highlightText: "Auto Timeline",
    subtitle:
      "Algorithmic Retention Hooks with Millisecond Audio Waveform Alignment",
    description:
      "Transform simple concepts into psychology-driven viral narrative scripts. The engine auto-segments copy into 8-second pacing beats synchronized to speech cadence and captions.",
    imageSrc: "/slide-2.jpg",
    imageAlt: "AI Scriptwriter and Automatic Timeline Waveform Alignment",
    features: [
      {
        id: "f2-1",
        title: "Viral Angle Discovery",
        description:
          "Explores solo traveler and educational hooks designed to stop doom-scrolling within the first 3 seconds.",
        metric: "3-Second Hook Rule",
      },
      {
        id: "f2-2",
        title: "8-Second Scene Chunking",
        description:
          "Maintains high viewer dopaminergic rhythm with automatic script-to-visual transition boundaries.",
        metric: "00:08 Pacing Beats",
      },
      {
        id: "f2-3",
        title: "Dynamic Subtitle Timing",
        description:
          "Synchronizes text captions directly to speaker audio frequencies for high retention.",
        metric: "Audio-Waveform Lock",
      },
    ],
    hotspots: [
      {
        x: 25,
        y: 44,
        label: "Viral Angle Selector",
        detail:
          "Audience psychological angle scoring (Solo Travel, Budget, Hidden Gems)",
      },
      {
        x: 55,
        y: 52,
        label: "AI Scriptwriter",
        detail:
          "Optimized for viral retention with narration stems and captions",
      },
      {
        x: 82,
        y: 52,
        label: "Auto Timeline",
        detail:
          "Real-time speech waveform with frame-accurate video cut stamps",
      },
    ],
    stats: [
      { label: "Audience Retention", value: "98.4%", change: "+42%" },
      { label: "Pacing Segments", value: "4 Beats", change: "8s each" },
      { label: "Audio Sync Accuracy", value: "< 15ms", change: "Frame-Locked" },
    ],
    ctaText: "Explore Scriptwriter",
    ctaHref: "/dashboard",
  },
  {
    id: 3,
    stepNumber: "03",
    badge: "Stage 3 • Visual Generation",
    badgeColor: "pink",
    title: "Automated Visual",
    highlightText: "Prompts Engine",
    subtitle: "Batch Parallel Scene Synthesis with Multi-Generator Syntax",
    description:
      "Convert script timestamps into 20 cinematic image prompts simultaneously. Live batch processing ensures coherent character lighting, color palettes, and stylistic continuity across all frames.",
    imageSrc: "/slide-3.jpg",
    imageAlt: "Stage 3 Automated Visual Prompts Generation Batch Engine",
    features: [
      {
        id: "f3-1",
        title: "Batch Parallel Processing",
        description:
          "Renders 20 scene prompts in parallel queues with live generation progress indicators.",
        metric: "20 Prompts at Once",
      },
      {
        id: "f3-2",
        title: "Universal Model Syntax",
        description:
          "One-click prompt formatting tailored for SDXL, Flux Schnell, Midjourney v6, Ideogram, and DALL-E 3.",
        metric: "5 Image Engines",
      },
      {
        id: "f3-3",
        title: "Style Continuity Guard",
        description:
          "Preserves camera angles, lighting temperature, and narrative themes across every generated asset.",
        metric: "100% Visual Cohesion",
      },
    ],
    hotspots: [
      {
        x: 10,
        y: 48,
        label: "Timestamped Script",
        detail:
          "Granular script breakdown mapped to distinct visual milestones",
      },
      {
        x: 41,
        y: 48,
        label: "Batch Generator",
        detail:
          "Live multi-threaded queue synthesizing 14/20 prompts in parallel",
      },
      {
        x: 72,
        y: 48,
        label: "Visual Prompt Grid",
        detail:
          "Ready-to-generate image prompts with aspect ratios and camera seeds",
      },
    ],
    stats: [
      { label: "Batch Capacity", value: "20 Prompts", change: "Parallel" },
      { label: "Style Continuity", value: "99.8%", change: "Enforced" },
      {
        label: "Model Exporters",
        value: "Flux / SDXL / MJ",
        change: "Instant",
      },
    ],
    ctaText: "Generate Visual Prompts",
    ctaHref: "/dashboard",
  },
  {
    id: 4,
    stepNumber: "04",
    badge: "Core Architecture • Resilience",
    badgeColor: "emerald",
    title: "Intelligent Multi-Model",
    highlightText: "AI Router",
    subtitle:
      "Zero-Downtime Smart Load Balancing & Sub-Second Rate-Limit Failover",
    description:
      "Experience unmatched resilience. FrameFlow dynamically routes requests between OpenAI, Anthropic Claude, and Google Gemini — instantly failing over during rate limits to keep generation seamless.",
    imageSrc: "/slide-4.jpg",
    imageAlt: "FrameFlow Multi-Model AI Router and Automatic Failover Graph",
    useImageBackground: true,
    features: [
      {
        id: "f4-1",
        title: "Sub-Second Automatic Failover",
        description:
          "Instantly detects HTTP 429 rate limits or network drops and reroutes to the optimal backup provider.",
        metric: "< 250ms Failover",
      },
      {
        id: "f4-2",
        title: "Provider Load Balancing",
        description:
          "Dynamically evaluates latency and model capacity between Claude, ChatGPT, and Gemini.",
        metric: "Auto Dynamic Routing",
      },
      {
        id: "f4-3",
        title: "Client-Side AES-256 Vault",
        description:
          "Your provider keys are encrypted locally and never exposed in plaintext to third-party databases.",
        metric: "Zero-Leak Security",
      },
    ],
    hotspots: [
      {
        x: 55,
        y: 46,
        label: "FrameFlow AI Router",
        detail:
          "Central dispatch orchestrating multi-LLM requests in real-time",
      },
      {
        x: 74,
        y: 35,
        label: "429 Rate Limit Detected",
        detail:
          "Automated trigger reroutes Claude request instantly to ChatGPT",
      },
      {
        x: 88,
        y: 64,
        label: "Generation Complete",
        detail:
          "Seamless output delivered in 12.4s without pipeline disruption",
      },
    ],
    stats: [
      { label: "System Uptime", value: "99.99%", change: "Enterprise" },
      { label: "Generation Latency", value: "12.4s", change: "High Speed" },
      {
        label: "Supported Providers",
        value: "OpenAI / Claude / Gemini",
        change: "Unified",
      },
    ],
    ctaText: "Configure Key Vault",
    ctaHref: "/settings",
  },
  {
    id: 5,
    stepNumber: "05",
    badge: "Stage 4 • Packaging & Publishing",
    badgeColor: "amber",
    title: "Complete Viral",
    highlightText: "Publishing Package",
    subtitle: "Automated Thumbnails, SEO Tags & 1-Click ZIP Production Bundle",
    description:
      "Everything needed to dominate search algorithms and social feeds. High-CTR 16:9 & 9:16 thumbnails, algorithmic descriptions, viral hashtags, and full video files bundled in a single click.",
    imageSrc: "/slide-5.jpg",
    imageAlt: "Stage 4 Complete Video Publishing Packaging Bundle",
    features: [
      {
        id: "f5-1",
        title: "High-CTR Visual Thumbnails",
        description:
          "Auto-generates both horizontal 16:9 and vertical 9:16 thumbnails with bold typography overlays.",
        metric: "Dual Aspect Ratios",
      },
      {
        id: "f5-2",
        title: "Algorithmic SEO & Hashtags",
        description:
          "Extracts high-ranking tags, keyword-dense descriptions, and platform-specific hashtags.",
        metric: "+248% Projected Reach",
      },
      {
        id: "f5-3",
        title: "1-Click Production ZIP",
        description:
          "Downloads finished MP4 video, thumbnail JPGs, metadata TXT, and scene timeline stamps in one archive.",
        metric: "All-in-One Bundle",
      },
    ],
    hotspots: [
      {
        x: 46,
        y: 36,
        label: "Title Hooks & Cover Art",
        detail: "High-conversion thumbnail and title hook testing pairs",
      },
      {
        x: 65,
        y: 44,
        label: "Production Video Player",
        detail:
          "Real-time preview with scrub controls and aspect ratio switcher",
      },
      {
        x: 88,
        y: 68,
        label: "Export Bundle Container",
        detail:
          "One-click ZIP containing MP4, thumbnails, description, and tags",
      },
    ],
    stats: [
      { label: "Projected Reach", value: "+248%", change: "vs Last 7 Days" },
      {
        label: "Bundle File Types",
        value: "MP4 / JPG / TXT",
        change: "Complete",
      },
      { label: "Export Speed", value: "Instant", change: "Client-Side ZIP" },
    ],
    ctaText: "Package Video Project",
    ctaHref: "/dashboard",
  },
];
