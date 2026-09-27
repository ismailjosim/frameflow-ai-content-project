import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { ensureDefaultPresets } from "@/lib/presets/default-presets";
import MasterPromptPreset from "@/models/MasterPromptPreset";
import Project from "@/models/Project";

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

// GET /api/projects - List all projects for user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);

    const projects = await Project.find({ userId })
      .sort({ updatedAt: -1 })
      .select(
        "title topicSlug status currentStage modelSelected modelUsed updatedAt createdAt",
      )
      .lean();

    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// POST /api/projects - Create a new video project
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultPresets();
    const userId = await getUserId(req);
    const body = await req.json();

    const { title, presetId, modelSelected } = body;

    const defaultPreset = await MasterPromptPreset.findOne({ isDefault: true });

    const newProject = await Project.create({
      title: title || "Untitled Video Project",
      topicSlug: (title || "untitled-video")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      userId,
      presetId: presetId || defaultPreset?._id,
      modelSelected: modelSelected || "auto",
      currentStage: 1,
      status: "draft",
      stageData: {
        topic: "",
        targetDuration: "16–22 minutes (2,600–3,400 words)",
        scriptText: "",
        timestampInput: "",
        imagePromptsText: "",
        packagingText: "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully!",
      project: newProject,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
