import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
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

// GET /api/presets/[id] - Get a single preset
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const preset = await MasterPromptPreset.findById(id).lean();
    if (!preset) {
      return NextResponse.json(
        { success: false, error: "Preset not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, preset });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch preset";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// DELETE /api/presets/[id] - Delete a style preset
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const { id } = await params;

    const preset = await MasterPromptPreset.findById(id);
    if (!preset) {
      return NextResponse.json(
        { success: false, error: "Preset not found" },
        { status: 404 },
      );
    }

    if (preset.isDefault) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete the default system style preset.",
        },
        { status: 400 },
      );
    }

    // Ensure preset belongs to this user or is user-created
    if (
      preset.userId &&
      preset.userId !== userId &&
      preset.userId !== "default-creator"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this preset." },
        { status: 403 },
      );
    }

    await MasterPromptPreset.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: `Preset "${preset.name}" deleted successfully.`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete preset";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// PATCH /api/presets/[id] - Update preset details or set as default
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const { id } = await params;
    const body = await req.json();

    const preset = await MasterPromptPreset.findById(id);
    if (!preset) {
      return NextResponse.json(
        { success: false, error: "Preset not found" },
        { status: 404 },
      );
    }

    // Check ownership if user-specific
    if (
      preset.userId &&
      preset.userId !== userId &&
      preset.userId !== "default-creator"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to edit this preset." },
        { status: 403 },
      );
    }

    // Handle setting default
    if (body.isDefault === true) {
      await MasterPromptPreset.updateMany(
        { _id: { $ne: id } },
        { $set: { isDefault: false } },
      );
      preset.isDefault = true;
    }

    // Update textual and prompt fields if provided
    if (typeof body.name === "string") {
      const trimmed = body.name.trim();
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Preset name cannot be empty." },
          { status: 400 },
        );
      }
      preset.name = trimmed;
    }

    if (typeof body.description === "string") {
      preset.description = body.description.trim();
    }

    if (typeof body.aspectRatio === "string") {
      preset.aspectRatio = body.aspectRatio.trim() || "--ar 16:9 --v 6.1";
    }

    if (typeof body.visualStyleRules === "string") {
      const trimmed = body.visualStyleRules.trim();
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Visual style rules cannot be empty." },
          { status: 400 },
        );
      }
      preset.visualStyleRules = trimmed;
    }

    if (typeof body.stage1Prompt === "string") {
      preset.stage1Prompt = body.stage1Prompt.trim();
    }
    if (typeof body.stage2Prompt === "string") {
      preset.stage2Prompt = body.stage2Prompt.trim();
    }
    if (typeof body.stage3Prompt === "string") {
      preset.stage3Prompt = body.stage3Prompt.trim();
    }
    if (typeof body.stage4Prompt === "string") {
      preset.stage4Prompt = body.stage4Prompt.trim();
    }

    await preset.save();

    return NextResponse.json({
      success: true,
      message: body.isDefault
        ? `Preset "${preset.name}" is now set as default.`
        : `Preset "${preset.name}" updated successfully.`,
      preset,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update preset";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// PUT /api/presets/[id] - Alias for PATCH
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return PATCH(req, context);
}
