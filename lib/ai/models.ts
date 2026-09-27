export interface AIModel {
  id: string;
  name: string;
  provider:
    | "openai"
    | "claude"
    | "gemini"
    | "meta"
    | "xai"
    | "deepseek"
    | "qwen"
    | "zai"
    | "mistral"
    | "cohere";
  desc: string;
  badge?: string;
  isReasoning?: boolean;
}

export interface ProviderGroup {
  provider:
    | "openai"
    | "claude"
    | "gemini"
    | "meta"
    | "xai"
    | "deepseek"
    | "qwen"
    | "zai"
    | "mistral"
    | "cohere";
  name: string;
  placeholder: string;
  defaultModel: string;
  models: AIModel[];
}

export const AUTO_MODEL: AIModel = {
  id: "auto",
  name: "Auto Model (Smart Fallback)",
  provider: "gemini",
  desc: "Gemini ➔ Claude ➔ OpenAI failover chain",
  badge: "Recommended",
};

// 1. OpenAI
export const OPENAI_MODELS: AIModel[] = [
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    provider: "openai",
    desc: "Flagship agentic reasoning & computer control",
    badge: "Frontier Flagship",
    isReasoning: true,
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    provider: "openai",
    desc: "General intelligence flagship with deep multimodal synthesis",
    badge: "Flagship",
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    provider: "openai",
    desc: "Cost-efficient frontier tier for high-throughput generation",
    badge: "Fast & Efficient",
  },
  {
    id: "gpt-4.5-preview",
    name: "GPT-4.5 Preview",
    provider: "openai",
    desc: "Massive world knowledge & deep contextual reasoning",
    badge: "Frontier",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    desc: "High-intelligence flagship multimodal model",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    desc: "Compact, fast & reliable for all pipeline stages",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "openai",
    desc: "High-speed reasoning model for structured logic & code",
    isReasoning: true,
  },
  {
    id: "o1",
    name: "o1",
    provider: "openai",
    desc: "Full reasoning model for deep problem solving",
    isReasoning: true,
  },
  {
    id: "o1-mini",
    name: "o1-mini",
    provider: "openai",
    desc: "Fast reasoning model tailored for math and logic",
    isReasoning: true,
  },
];

// 2. Anthropic
export const CLAUDE_MODELS: AIModel[] = [
  {
    id: "claude-opus-5.5",
    name: "Claude Opus 5.5",
    provider: "claude",
    desc: "State-of-the-art adaptive reasoning & complex creative tasks",
    badge: "Top Reasoning",
    isReasoning: true,
  },
  {
    id: "claude-fable-5.1",
    name: "Claude Fable 5.1",
    provider: "claude",
    desc: "Specialized advanced logic, storytelling & math engine",
    badge: "Specialized",
    isReasoning: true,
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "claude",
    desc: "High-performance enterprise & coding model",
    badge: "Flagship",
  },
  {
    id: "claude-3-7-sonnet-20250219",
    name: "Claude 3.7 Sonnet",
    provider: "claude",
    desc: "Hybrid reasoning & exceptional storytelling nuance",
    isReasoning: true,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet (v2)",
    provider: "claude",
    desc: "Creative scriptwriting & image prompt synthesis",
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "claude",
    desc: "Ultra-fast speed & high efficiency",
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "claude",
    desc: "Deep analytical narrative synthesis",
  },
];

// 3. Google DeepMind
export const GEMINI_MODELS: AIModel[] = [
  {
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    provider: "gemini",
    desc: "Flagship reasoning & high-speed multimodal synthesis (Generous Quota)",
    badge: "Recommended",
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    provider: "gemini",
    desc: "Frontier tier multimodal inference",
    badge: "Frontier",
  },
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "gemini",
    desc: "High-throughput low-latency workhorse",
    badge: "Fast",
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    provider: "gemini",
    desc: "Ultra-low latency lightweight generation",
    badge: "Ultra Fast",
  },
  {
    id: "gemini-3.5-pro",
    name: "Gemini 3.5 Pro",
    provider: "gemini",
    desc: "Long-context reasoning & document analysis",
    badge: "Flagship Pro",
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "gemini",
    desc: "Multimodal & agentic workflow flagship",
    badge: "Agentic",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "gemini",
    desc: "Legacy baseline (deprecated for new users)",
    badge: "Legacy",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "gemini",
    desc: "Deep thinking & multimodal analysis",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    desc: "High-speed generation with real-time audio/visual grounding",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    provider: "gemini",
    desc: "Cost-efficient & ultra-low latency",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "gemini",
    desc: "Massive 2M token context window",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "gemini",
    desc: "Reliable high-throughput workhorse model",
  },
];

// 4. Meta AI (Open-Weight)
export const META_MODELS: AIModel[] = [
  {
    id: "muse-spark-1.3",
    name: "Muse Spark 1.3",
    provider: "meta",
    desc: "High-throughput open-weight flagship generative model",
    badge: "Open Weight",
  },
  {
    id: "llama-4-scout",
    name: "Meta Llama 4 Scout",
    provider: "meta",
    desc: "Ultra-long context window frontier architecture",
    badge: "Long Context",
  },
  {
    id: "llama-3.3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    provider: "meta",
    desc: "Open foundation model competitive with proprietary flagships",
  },
];

// 5. xAI
export const XAI_MODELS: AIModel[] = [
  {
    id: "grok-4.7",
    name: "Grok 4.7",
    provider: "xai",
    desc: "Real-time reasoning & web integration",
    badge: "Real-Time",
    isReasoning: true,
  },
  {
    id: "grok-4.5",
    name: "Grok 4.5",
    provider: "xai",
    desc: "Flagship multimodal intelligence with unfiltered creativity",
    badge: "Flagship",
  },
  {
    id: "grok-4-fast",
    name: "Grok 4 Fast",
    provider: "xai",
    desc: "Low-latency general response model",
  },
];

// 6. DeepSeek
export const DEEPSEEK_MODELS: AIModel[] = [
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    desc: "Open-weight frontier model with deep reasoning",
    badge: "Frontier MoE",
    isReasoning: true,
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
    desc: "High-volume cost-optimized inference tier",
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek V3 (Chat)",
    provider: "deepseek",
    desc: "MoE architecture base model with high efficiency",
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek R1 (Reasoner)",
    provider: "deepseek",
    desc: "Chain-of-thought open reasoning model",
    isReasoning: true,
  },
];

// 7. Alibaba Cloud (Qwen)
export const QWEN_MODELS: AIModel[] = [
  {
    id: "qwen-3.8-max",
    name: "Qwen 3.8 Max",
    provider: "qwen",
    desc: "Proprietary large-scale flagship with broad domain mastery",
    badge: "Flagship",
  },
  {
    id: "qwen-3.7-max",
    name: "Qwen 3.7 Max",
    provider: "qwen",
    desc: "Enterprise generalist model for high-fidelity content",
  },
  {
    id: "qwen-2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder",
    provider: "qwen",
    desc: "Specialized coding & structured syntax generation",
  },
];

// 8. Z.ai (Zhipu AI)
export const ZAI_MODELS: AIModel[] = [
  {
    id: "glm-5.3",
    name: "GLM-5.3",
    provider: "zai",
    desc: "Ultra-long context open-weight model",
    badge: "Extended Context",
  },
  {
    id: "glm-5.2",
    name: "GLM-5.2",
    provider: "zai",
    desc: "High-capacity open-weight release",
  },
  {
    id: "glm-4-plus",
    name: "GLM-4 Plus",
    provider: "zai",
    desc: "General purpose flagship API model",
  },
];

// 9. Mistral AI
export const MISTRAL_MODELS: AIModel[] = [
  {
    id: "mistral-large-2411",
    name: "Mistral Large 2",
    provider: "mistral",
    desc: "Enterprise flagship proprietary model with 128k context",
    badge: "Flagship",
  },
  {
    id: "codestral-2501",
    name: "Codestral",
    provider: "mistral",
    desc: "Developer-focused code generation & precise syntax synthesis",
  },
  {
    id: "open-mixtral-8x22b",
    name: "Mixtral 8x22B",
    provider: "mistral",
    desc: "High-efficiency open Sparse Mixture-of-Experts",
  },
];

// 10. Cohere
export const COHERE_MODELS: AIModel[] = [
  {
    id: "command-r-plus-08-2024",
    name: "Command R+",
    provider: "cohere",
    desc: "Enterprise agent & RAG optimized model with high accuracy",
    badge: "RAG Leader",
  },
  {
    id: "command-r-08-2024",
    name: "Command R",
    provider: "cohere",
    desc: "Scalable enterprise language model for production tasks",
  },
  {
    id: "embed-english-v3.0",
    name: "Embed v3",
    provider: "cohere",
    desc: "Enterprise semantic retrieval & search model",
  },
];

export const ALL_MODELS: AIModel[] = [
  ...OPENAI_MODELS,
  ...CLAUDE_MODELS,
  ...GEMINI_MODELS,
  ...META_MODELS,
  ...XAI_MODELS,
  ...DEEPSEEK_MODELS,
  ...QWEN_MODELS,
  ...ZAI_MODELS,
  ...MISTRAL_MODELS,
  ...COHERE_MODELS,
];

export const PROVIDER_GROUPS: ProviderGroup[] = [
  {
    provider: "gemini",
    name: "Google DeepMind (Gemini)",
    placeholder: "AIzaSy...",
    defaultModel: "gemini-3.7-flash",
    models: GEMINI_MODELS,
  },
  {
    provider: "claude",
    name: "Anthropic (Claude)",
    placeholder: "sk-ant-api03-...",
    defaultModel: "claude-3-7-sonnet-20250219",
    models: CLAUDE_MODELS,
  },
  {
    provider: "openai",
    name: "OpenAI (GPT / Reasoning)",
    placeholder: "sk-proj-...",
    defaultModel: "gpt-4o-mini",
    models: OPENAI_MODELS,
  },
  {
    provider: "xai",
    name: "xAI (Grok)",
    placeholder: "xai-...",
    defaultModel: "grok-4.5",
    models: XAI_MODELS,
  },
  {
    provider: "deepseek",
    name: "DeepSeek",
    placeholder: "sk-...",
    defaultModel: "deepseek-chat",
    models: DEEPSEEK_MODELS,
  },
  {
    provider: "mistral",
    name: "Mistral AI",
    placeholder: "mistral-...",
    defaultModel: "mistral-large-2411",
    models: MISTRAL_MODELS,
  },
  {
    provider: "meta",
    name: "Meta AI (Open-Weight / Together)",
    placeholder: "together-... / groq-...",
    defaultModel: "llama-3.3-70b-instruct",
    models: META_MODELS,
  },
  {
    provider: "qwen",
    name: "Alibaba Cloud (Qwen)",
    placeholder: "sk-... (DashScope)",
    defaultModel: "qwen-2.5-coder-32b-instruct",
    models: QWEN_MODELS,
  },
  {
    provider: "zai",
    name: "Z.ai (Zhipu AI GLM)",
    placeholder: "api_key.id (BigModel)",
    defaultModel: "glm-4-plus",
    models: ZAI_MODELS,
  },
  {
    provider: "cohere",
    name: "Cohere",
    placeholder: "co-...",
    defaultModel: "command-r-plus-08-2024",
    models: COHERE_MODELS,
  },
];

export const PROVIDER_BASE_URLS: Record<string, string | undefined> = {
  openai: undefined,
  xai: "https://api.x.ai/v1",
  deepseek: "https://api.deepseek.com",
  mistral: "https://api.mistral.ai/v1",
  meta: "https://api.together.xyz/v1",
  qwen: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  zai: "https://open.bigmodel.cn/api/paas/v4",
  cohere: "https://api.cohere.com/v2",
};

// Aliases mapping conceptual / unreleased models to currently active live API counterparts
export const MODEL_API_ALIASES: Record<string, string> = {
  // Google DeepMind (gemini-3.7-flash has generous quota and verified 200 OK)
  "gemini-3.7-flash": "gemini-3.7-flash",
  "gemini-3.8-flash": "gemini-3.8-flash",
  "gemini-3.5-flash": "gemini-3.5-flash",
  "gemini-3.1-flash-lite": "gemini-3.1-flash-lite",
  "gemini-3.5-pro": "gemini-3.7-flash",
  "gemini-3.1-pro": "gemini-3.7-flash",
  "gemini-2.5-flash": "gemini-3.7-flash",
  "gemini-2.5-pro": "gemini-3.7-flash",
  "gemini-flash-latest": "gemini-3.7-flash",
  "gemini-pro-latest": "gemini-3.7-flash",

  // OpenAI
  "gpt-6-astra": "gpt-4.5-preview",
  "gpt-5.6-sol": "gpt-4o",
  "gpt-5.6-luna": "gpt-4o-mini",

  // Anthropic
  "claude-opus-5.5": "claude-3-7-sonnet-20250219",
  "claude-fable-5.1": "claude-3-7-sonnet-20250219",
  "claude-sonnet-5": "claude-3-7-sonnet-20250219",

  // Meta AI
  "muse-spark-1.3": "meta-llama/Llama-3.3-70B-Instruct",
  "llama-4-scout": "meta-llama/Llama-3.3-70B-Instruct",
  "llama-3.3-70b-instruct": "meta-llama/Llama-3.3-70B-Instruct",

  // xAI
  "grok-4.7": "grok-2-1212",
  "grok-4.5": "grok-2-1212",
  "grok-4-fast": "grok-2-1212",

  // DeepSeek
  "deepseek-v4-pro": "deepseek-reasoner",
  "deepseek-v4-flash": "deepseek-chat",

  // Qwen
  "qwen-3.8-max": "qwen-max",
  "qwen-3.7-max": "qwen-plus",
  "qwen-2.5-coder-32b-instruct": "qwen-2.5-coder-32b-instruct",

  // Z.ai
  "glm-5.3": "glm-4-plus",
  "glm-5.2": "glm-4-plus",

  // Mistral
  "mistral-large-2411": "mistral-large-latest",
  "codestral-2501": "codestral-latest",

  // Cohere
  "command-r-plus-08-2024": "command-r-plus",
  "command-r-08-2024": "command-r",
};

export function resolveActualApiModel(modelId: string): string {
  return MODEL_API_ALIASES[modelId] || modelId;
}

export const PROVIDER_DEFAULT_FALLBACKS: Record<string, string> = {
  gemini: "gemini-3.7-flash",
  claude: "claude-3-7-sonnet-20250219",
  openai: "gpt-4o-mini",
  deepseek: "deepseek-chat",
  xai: "grok-2-1212",
  mistral: "mistral-large-latest",
  meta: "meta-llama/Llama-3.3-70B-Instruct",
  qwen: "qwen-max",
  zai: "glm-4-plus",
  cohere: "command-r-plus",
};

export function getProviderForModel(
  modelId: string,
): ProviderGroup["provider"] {
  const match = ALL_MODELS.find((m) => m.id === modelId);
  if (match) return match.provider;

  if (modelId.startsWith("gemini")) return "gemini";
  if (modelId.startsWith("claude")) return "claude";
  if (modelId.startsWith("grok")) return "xai";
  if (modelId.startsWith("deepseek")) return "deepseek";
  if (
    modelId.startsWith("mistral") ||
    modelId.startsWith("codestral") ||
    modelId.startsWith("mixtral")
  )
    return "mistral";
  if (modelId.startsWith("qwen")) return "qwen";
  if (modelId.startsWith("glm")) return "zai";
  if (modelId.startsWith("command") || modelId.startsWith("embed"))
    return "cohere";
  if (modelId.startsWith("llama") || modelId.startsWith("muse")) return "meta";

  return "openai";
}

export function isReasoningModel(modelId: string): boolean {
  const match = ALL_MODELS.find((m) => m.id === modelId);
  if (match?.isReasoning !== undefined) return match.isReasoning;

  return (
    modelId.startsWith("o1") ||
    modelId.startsWith("o3") ||
    modelId.startsWith("o4") ||
    modelId.includes("reasoner") ||
    modelId.includes("astra")
  );
}
