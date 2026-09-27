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
