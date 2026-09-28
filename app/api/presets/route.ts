import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import {
  ensureDefaultPresets,
  FRAMEFLOW_DEFAULT_PRESET,
} from "@/lib/presets/default-presets";
import MasterPromptPreset from "@/models/MasterPromptPreset";

interface UserInfo {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
}

async function getUserInfo(req: NextRequest): Promise<UserInfo> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) {
      return {
        id: session.user.id,
        name: session.user.name || "Creator",
        email: session.user.email || null,
        image: session.user.image || null,
      };
    }
  } catch {
    // fallback
  }
  return {
    id: req.headers.get("x-user-id") || "default-creator",
    name: req.headers.get("x-user-name") || "Creator",
    email: req.headers.get("x-user-email") || null,
    image: null,
  };
}

// GET /api/presets - List all presets
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultPresets();
    const userInfo = await getUserInfo(req);

    // Fetch system defaults (userId: null) or user-created presets
    const presets = await MasterPromptPreset.find({
      $or: [{ userId: null }, { userId: userInfo.id }],
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
    const userInfo = await getUserInfo(req);
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
      userName,
      userEmail,
      userImage,
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
      userId: userInfo.id,
      userName: userName || userInfo.name || "Creator",
      userEmail: userEmail || userInfo.email || undefined,
      userImage: userImage || userInfo.image || undefined,
      isDefault: false,
      visualStyleRules,
      stage1Prompt: stage1Prompt || FRAMEFLOW_DEFAULT_PRESET.stage1Prompt,
      stage2Prompt: stage2Prompt || FRAMEFLOW_DEFAULT_PRESET.stage2Prompt,
      stage3Prompt: stage3Prompt || FRAMEFLOW_DEFAULT_PRESET.stage3Prompt,
      stage4Prompt: stage4Prompt || FRAMEFLOW_DEFAULT_PRESET.stage4Prompt,
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
