import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import {
  ensureDefaultPresets,
  HOMODOODLE_DEFAULT_PRESET,
} from "@/lib/presets/default-presets";
import MasterPromptPreset from "@/models/MasterPromptPreset";

async function getUserId(req: NextRequest): Promise<string> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch {
    // fallback
  }
  return req.headers.get("x-user-id") || "default-creator";
}

// GET /api/presets - List all presets
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultPresets();
    const userId = await getUserId(req);

    // Fetch system defaults (userId: null) or user-created presets
    const presets = await MasterPromptPreset.find({
      $or: [{ userId: null }, { userId }],
    })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, presets });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch presets";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// POST /api/presets - Create a new master prompt style preset
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const body = await req.json();

    const {
      name,
      description,
      visualStyleRules,
      stage1Prompt,
      stage2Prompt,
      stage3Prompt,
      stage4Prompt,
      aspectRatio,
      rawMasterFile,
    } = body;

    if (!name || !visualStyleRules) {
      return NextResponse.json(
        { success: false, error: "Name and Visual Style Rules are required." },
        { status: 400 },
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newPreset = await MasterPromptPreset.create({
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description: description || "Custom video production art style",
      userId,
      isDefault: false,
      visualStyleRules,
      stage1Prompt: stage1Prompt || HOMODOODLE_DEFAULT_PRESET.stage1Prompt,
      stage2Prompt: stage2Prompt || HOMODOODLE_DEFAULT_PRESET.stage2Prompt,
      stage3Prompt: stage3Prompt || HOMODOODLE_DEFAULT_PRESET.stage3Prompt,
      stage4Prompt: stage4Prompt || HOMODOODLE_DEFAULT_PRESET.stage4Prompt,
      aspectRatio: aspectRatio || "--ar 16:9 --v 6.1",
      rawMasterFile: rawMasterFile || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Master style preset created successfully!",
      preset: newPreset,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create preset";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
