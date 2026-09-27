import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
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

// GET /api/projects/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const { id } = await params;

    const project = await Project.findOne({ _id: id, userId }).populate(
      "presetId",
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/[id] - Update stage text data or settings
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "title",
      "topicSlug",
      "presetId",
      "modelSelected",
      "modelUsed",
      "currentStage",
      "status",
      "stageData",
    ];

    const updateObj: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateObj[field] = body[field];
      }
    }

    // Auto-update topicSlug if title changes
    if (body.title && !body.topicSlug) {
      updateObj.topicSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateObj },
      { returnDocument: "after" },
    );

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const { id } = await params;

    const res = await Project.deleteOne({ _id: id, userId });
    if (res.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
