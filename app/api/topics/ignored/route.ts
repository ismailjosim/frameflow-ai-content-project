import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import IgnoredTopic from "@/models/IgnoredTopic";

async function getUserId(req: NextRequest): Promise<string> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) return session.user.id;
  } catch {
    // fallback
  }
  return req.headers.get("x-user-id") || "default-creator";
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);

    const ignored = await IgnoredTopic.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      ignoredTopics: ignored,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch ignored topics";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const body = await req.json();
    const { topicTitle, reason } = body;

    if (!topicTitle || typeof topicTitle !== "string" || !topicTitle.trim()) {
      return NextResponse.json(
        { success: false, error: "Topic title is required" },
        { status: 400 },
      );
    }

    const trimmedTitle = topicTitle.trim();
    const normalized = trimmedTitle.toLowerCase();

    const ignored = await IgnoredTopic.findOneAndUpdate(
      { userId, normalizedTitle: normalized },
      {
        userId,
        topicTitle: trimmedTitle,
        normalizedTitle: normalized,
        reason: reason || "already_created",
      },
      { upsert: true, returnDocument: "after" },
    );

    return NextResponse.json({
      success: true,
      message: `Topic "${trimmedTitle}" added to ignored list.`,
      ignoredTopic: ignored,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to ignore topic";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserId(req);
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const title = url.searchParams.get("title");

    if (id) {
      await IgnoredTopic.findOneAndDelete({ _id: id, userId });
    } else if (title) {
      await IgnoredTopic.findOneAndDelete({
        userId,
        normalizedTitle: title.trim().toLowerCase(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: "id or title query param is required" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Topic unignored and restored successfully.",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to unignore topic";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
