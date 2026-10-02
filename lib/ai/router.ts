import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import {
  getProviderForModel,
  isReasoningModel,
  PROVIDER_BASE_URLS,
  PROVIDER_DEFAULT_FALLBACKS,
  PROVIDER_GROUPS,
  type ProviderGroup,
  resolveActualApiModel,
} from "@/lib/ai/models";
import { decryptApiKey } from "@/lib/encryption";
import connectToDatabase from "@/lib/mongodb";
import ApiKeyVault, { type IApiKeyVault } from "@/models/ApiKeyVault";

export interface GenerationRequest {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface GenerationResult {
  text: string;
  provider: ProviderGroup["provider"] | string;
  modelUsed: string;
  logs: string[];
  finishReason?: string;
}

interface ProviderApiResponse {
  text: string;
  finishReason?: string;
}

async function callProviderAPI(
  provider: ProviderGroup["provider"] | string,
  model: string,
  apiKey: string,
  request: GenerationRequest,
): Promise<ProviderApiResponse> {
  const actualModel = resolveActualApiModel(model);

  if (provider === "gemini") {
    const ai = new GoogleGenAI({ apiKey });
    const config: Record<string, unknown> = {};
    if (request.systemPrompt) {
      config.systemInstruction = request.systemPrompt;
    }
    if (request.jsonMode) {
      config.responseMimeType = "application/json";
    }
    if (request.temperature !== undefined) {
      config.temperature = request.temperature;
    }

    // Try candidate models in order: requested actualModel -> gemini-3.7-flash -> gemini-3.5-flash -> gemini-3.1-flash-lite
    const candidateModels = Array.from(
      new Set([
        actualModel,
        "gemini-3.7-flash",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
      ]),
    );

    let lastGeminiErr: unknown = null;
    for (const candidate of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          model: candidate,
          contents: request.userPrompt,
          config,
        });

        if (res.text !== undefined && res.text !== null) {
          const candidateObj = res.candidates?.[0];
          const finishReason = candidateObj?.finishReason
            ? String(candidateObj.finishReason)
            : undefined;
          return { text: res.text, finishReason };
        }
      } catch (geminiErr: unknown) {
        lastGeminiErr = geminiErr;
        const msg =
          geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
        const isTransientOrQuota =
          msg.includes("404") ||
          msg.toLowerCase().includes("not found") ||
          msg.toLowerCase().includes("no longer available") ||
          msg.includes("429") ||
          msg.toLowerCase().includes("quota") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.toLowerCase().includes("high demand");

        if (
          isTransientOrQuota &&
          candidate !== candidateModels[candidateModels.length - 1]
        ) {
          continue;
        }
        throw geminiErr;
      }
    }
    throw lastGeminiErr || new Error("Gemini generation failed");
  } else if (provider === "claude") {
    const anthropic = new Anthropic({ apiKey });
    const res = await anthropic.messages.create({
      model: actualModel,
      max_tokens: request.maxTokens || 4000,
      system: request.systemPrompt,
      messages: [
        {
          role: "user",
          content: request.userPrompt,
        },
      ],
    });

    const firstBlock = res.content[0];
    const text = firstBlock.type === "text" ? firstBlock.text : "";
    const finishReason = res.stop_reason ? String(res.stop_reason) : undefined;
    return { text, finishReason };
  } else {
    // OpenAI or OpenAI-compatible provider (xAI, DeepSeek, Mistral, Meta, Qwen, Z.ai, Cohere)
    const baseURL = PROVIDER_BASE_URLS[provider];
    const openai = new OpenAI({
      apiKey,
      baseURL: baseURL || undefined,
    });
    const reasoning = isReasoningModel(actualModel);
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (request.systemPrompt) {
      if (reasoning) {
        messages.push({ role: "developer", content: request.systemPrompt });
      } else {
        messages.push({ role: "system", content: request.systemPrompt });
      }
    }
    messages.push({ role: "user", content: request.userPrompt });

    const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
      {
        model: actualModel,
        messages,
      };

    if (request.jsonMode && actualModel !== "o1-mini") {
      completionParams.response_format = { type: "json_object" };
    }

    if (!reasoning && request.temperature !== undefined) {
      completionParams.temperature = request.temperature;
    }

    if (reasoning) {
      if (request.maxTokens) {
        completionParams.max_completion_tokens = request.maxTokens;
      }
    } else if (request.maxTokens) {
      completionParams.max_tokens = request.maxTokens;
    }

    const res = await openai.chat.completions.create(completionParams);
    const text = res.choices[0]?.message?.content || "";
    const finishReason = res.choices[0]?.finish_reason
      ? String(res.choices[0].finish_reason)
      : undefined;
    return { text, finishReason };
  }
}

export async function executeAIRequest(
  userId: string,
  request: GenerationRequest,
  selectedModel: string = "auto",
): Promise<GenerationResult> {
  await connectToDatabase();

  const userKeys: IApiKeyVault[] = await ApiKeyVault.find({
    userId,
    isActive: true,
  });

  // Create decrypted key map
  const keyMap = new Map<string, { apiKey: string; preferredModel?: string }>();
  if (userKeys && userKeys.length > 0) {
    for (const record of userKeys) {
      try {
        const decrypted = decryptApiKey({
          ciphertext: record.ciphertext,
          iv: record.iv,
          authTag: record.authTag,
        });
        keyMap.set(record.provider, {
          apiKey: decrypted,
          preferredModel: record.preferredModel,
        });
      } catch {
        // Skip corrupt keys
      }
    }
  }

  // Fall back to environment variables if key not in DB (e.g. from .env.local)
  const envKeyBindings: Array<{
    provider: string;
    envKeys: string[];
    defaultModel: string;
  }> = [
    {
      provider: "gemini",
      envKeys: [
        "GEMINI_API_KEY",
        "GOOGLE_API_KEY",
        "NEXT_PUBLIC_GEMINI_API_KEY",
      ],
      defaultModel: "gemini-3.7-flash",
    },
    {
      provider: "claude",
      envKeys: ["ANTHROPIC_API_KEY", "CLAUDE_API_KEY"],
      defaultModel: "claude-3-7-sonnet-20250219",
    },
    {
      provider: "openai",
      envKeys: ["OPENAI_API_KEY"],
      defaultModel: "gpt-4o-mini",
    },
    {
      provider: "xai",
      envKeys: ["XAI_API_KEY", "GROK_API_KEY"],
      defaultModel: "grok-4.5",
    },
    {
      provider: "deepseek",
      envKeys: ["DEEPSEEK_API_KEY"],
      defaultModel: "deepseek-chat",
    },
    {
      provider: "mistral",
      envKeys: ["MISTRAL_API_KEY"],
      defaultModel: "mistral-large-2411",
    },
    {
      provider: "meta",
      envKeys: ["TOGETHER_API_KEY", "GROQ_API_KEY"],
      defaultModel: "llama-3.3-70b-instruct",
    },
  ];

  for (const b of envKeyBindings) {
    if (!keyMap.has(b.provider)) {
      for (const k of b.envKeys) {
        const val = process.env[k];
        if (val && val.trim().length > 0) {
          keyMap.set(b.provider, {
            apiKey: val.trim(),
            preferredModel: b.defaultModel,
          });
          break;
        }
      }
    }
  }

  if (keyMap.size === 0) {
    throw new Error(
      "No active API keys found. Please configure your API key (e.g. Google Gemini) in Settings or .env.local.",
    );
  }

  const logs: string[] = [];

  // Determine provider candidates order
  type ProviderAttempt = {
    provider: ProviderGroup["provider"] | string;
    model: string;
  };

  const attempts: ProviderAttempt[] = [];

  if (selectedModel !== "auto") {
    const targetProvider = getProviderForModel(selectedModel);
    if (keyMap.has(targetProvider)) {
      attempts.push({ provider: targetProvider, model: selectedModel });
    } else {
      // Single-key smart adaptation: The user selected a model for a provider whose key is missing.
      // Automatically route to their active configured provider instead of throwing an error!
      const availableProviders = Array.from(keyMap.keys());
      const fallbackProvider =
        availableProviders[0] as ProviderGroup["provider"];
      const group = PROVIDER_GROUPS.find(
        (g) => g.provider === fallbackProvider,
      );
      const fallbackModel =
        keyMap.get(fallbackProvider)?.preferredModel ||
        group?.defaultModel ||
        PROVIDER_DEFAULT_FALLBACKS[fallbackProvider] ||
        "gemini-3.7-flash";

      logs.push(
        `Selected model [${selectedModel}] requires ${targetProvider.toUpperCase()} key (not configured in Vault). Auto-adapting to active provider [${fallbackProvider} :: ${fallbackModel}].`,
      );
      attempts.push({ provider: fallbackProvider, model: fallbackModel });
    }
  } else {
    // Auto Mode: Try providers in priority order
    const providerPriority: Array<ProviderGroup["provider"]> = [
      "gemini",
      "claude",
      "openai",
      "xai",
      "deepseek",
      "mistral",
      "meta",
      "qwen",
      "zai",
      "cohere",
    ];
    for (const p of providerPriority) {
      if (keyMap.has(p)) {
        const group = PROVIDER_GROUPS.find((g) => g.provider === p);
        attempts.push({
          provider: p,
          model:
            keyMap.get(p)?.preferredModel ||
            group?.defaultModel ||
            "gemini-3.7-flash",
        });
      }
    }
  }

  if (attempts.length === 0) {
    throw new Error(
      `No configured API key matches the requested model "${selectedModel}". Please add the appropriate key in Settings.`,
    );
  }

  let lastError: unknown = null;

  for (const attempt of attempts) {
    const creds = keyMap.get(attempt.provider);
    if (!creds?.apiKey) {
      logs.push(`Skipping ${attempt.provider}: Key not configured.`);
      continue;
    }

    try {
      logs.push(
        `Executing request with [${attempt.provider} :: ${attempt.model}]...`,
      );
      let providerRes: ProviderApiResponse = { text: "" };

      try {
        providerRes = await callProviderAPI(
          attempt.provider,
          attempt.model,
          creds.apiKey,
          request,
        );
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        const isNotFound =
          errMsg.toLowerCase().includes("not found") || errMsg.includes("404");
        const fallbackModel = PROVIDER_DEFAULT_FALLBACKS[attempt.provider];

        if (
          isNotFound &&
          fallbackModel &&
          resolveActualApiModel(attempt.model) !== fallbackModel
        ) {
          logs.push(
            `Model [${attempt.model}] not found on ${attempt.provider}. Automatically falling back to verified baseline [${fallbackModel}]...`,
          );
          providerRes = await callProviderAPI(
            attempt.provider,
            fallbackModel,
            creds.apiKey,
            request,
          );
        } else {
          throw err;
        }
      }

      if (providerRes.text && providerRes.text.trim().length > 0) {
        logs.push(`Success with [${attempt.provider} :: ${attempt.model}]!`);
        return {
          text: providerRes.text.trim(),
          provider: attempt.provider,
          modelUsed: attempt.model,
          logs,
          finishReason: providerRes.finishReason,
        };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logs.push(
        `Failed on [${attempt.provider} :: ${attempt.model}]: ${errMsg}. Triggering fallback...`,
      );
      lastError = err;
    }
  }

  throw new Error(
    `All available AI providers failed. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}. Execution trace: ${logs.join(" -> ")}`,
  );
}
