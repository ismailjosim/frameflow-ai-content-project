import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { PROVIDER_GROUPS } from "@/lib/ai/models";
import { auth } from "@/lib/auth";
import { encryptApiKey, maskApiKey } from "@/lib/encryption";
import connectToDatabase from "@/lib/mongodb";
import ApiKeyVault from "@/models/ApiKeyVault";

async function getUserId(req: NextRequest): Promise<string> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch {
    // Fall back to default-creator if session is absent
  }
  return req.headers.get("x-user-id") || "default-creator";
}

// GET /api/keys - List all configured keys for the user (masked) + env keys
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);

    const keys = await ApiKeyVault.find({ userId })
      .select(
        "provider maskedKey isActive preferredModel lastTested updatedAt statusMessage",
      )
      .lean();

    const activeProviders = new Set<string>();
    for (const k of keys) {
      if (k.isActive) activeProviders.add(k.provider);
    }

    if (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ) {
      activeProviders.add("gemini");
    }
    if (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY) {
      activeProviders.add("claude");
    }
    if (process.env.OPENAI_API_KEY) {
      activeProviders.add("openai");
    }
    if (process.env.XAI_API_KEY || process.env.GROK_API_KEY) {
      activeProviders.add("xai");
    }
    if (process.env.DEEPSEEK_API_KEY) {
      activeProviders.add("deepseek");
    }
    if (process.env.MISTRAL_API_KEY) {
      activeProviders.add("mistral");
    }
    if (process.env.TOGETHER_API_KEY || process.env.GROQ_API_KEY) {
      activeProviders.add("meta");
    }

    return NextResponse.json({
      success: true,
      keys,
      configuredProviders: Array.from(activeProviders),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch API keys";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// POST /api/keys - Encrypt and save/update an API key
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const body = await req.json();

    const { provider, apiKey, preferredModel } = body;

    if (
      !provider ||
      !apiKey ||
      typeof apiKey !== "string" ||
      apiKey.trim().length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Provider and valid apiKey are required." },
        { status: 400 },
      );
    }

    const validProviders = PROVIDER_GROUPS.map((g) => g.provider);
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid provider. Must be one of: ${validProviders.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Encrypt the key
    const encrypted = encryptApiKey(apiKey.trim());
    const masked = maskApiKey(apiKey.trim());

    // Upsert key in DB
    const keyDoc = await ApiKeyVault.findOneAndUpdate(
      { userId, provider },
      {
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        maskedKey: masked,
        isActive: true,
        preferredModel: preferredModel || undefined,
        lastTested: new Date(),
        statusMessage: "Configured and encrypted successfully",
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    return NextResponse.json({
      success: true,
      message: `${provider} key encrypted and saved securely!`,
      key: {
        provider: keyDoc.provider,
        maskedKey: keyDoc.maskedKey,
        isActive: keyDoc.isActive,
        preferredModel: keyDoc.preferredModel,
        updatedAt: keyDoc.updatedAt,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save API key";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// DELETE /api/keys - Delete a specific provider key
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const { searchParams } = new URL(req.url);
    const providerParam = searchParams.get("provider");
    const validProviders = PROVIDER_GROUPS.map((g) => g.provider);
    if (
      !providerParam ||
      !validProviders.includes(providerParam as (typeof validProviders)[number])
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Valid provider (${validProviders.join(", ")}) is required`,
        },
        { status: 400 },
      );
    }

    const provider = providerParam;
    await ApiKeyVault.deleteOne({ userId, provider });

    return NextResponse.json({
      success: true,
      message: `${provider} key deleted from vault.`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete key";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
