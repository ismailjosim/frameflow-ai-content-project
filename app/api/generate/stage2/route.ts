import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { executeAIRequest } from "@/lib/ai/router";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import {
  ensureDefaultPresets,
  HOMODOODLE_DEFAULT_PRESET,
} from "@/lib/presets/default-presets";
import MasterPromptPreset from "@/models/MasterPromptPreset";
import Project from "@/models/Project";

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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultPresets();
    const userId = await getUserId(req);
    const { projectId, topic, model } = await req.json();

    if (!topic?.title) {
      return NextResponse.json(
        {
          success: false,
          error: "Topic title is required for Stage 2 script generation.",
        },
        { status: 400 },
      );
    }

    let preset = null;
    let project = null;

    if (projectId) {
      project = await Project.findOne({ _id: projectId, userId });
      if (project?.presetId) {
        preset = await MasterPromptPreset.findById(project.presetId);
      }
    }

    if (!preset) {
      preset =
        (await MasterPromptPreset.findOne({ isDefault: true })) ||
        HOMODOODLE_DEFAULT_PRESET;
    }

    const userPrompt = `TOPIC: "${topic.title}"
SURVIVAL CONFLICT / HOOK: "${topic.conflict || topic.title}"
FORMULA: "${topic.formula || "Documentary"}"

Write the complete narration voiceover script following all line-break and character-limit rules strictly.`;

    const result = await executeAIRequest(
      userId,
      {
        systemPrompt: preset.stage2Prompt,
        userPrompt,
        temperature: 0.6,
        maxTokens: 8000,
      },
      model || project?.modelSelected || "auto",
    );

    // Save into project if projectId provided
    if (projectId && project) {
      project.stageData.scriptText = result.text;
      project.stageData.topic = topic.title;
      project.stageData.topicDetails = {
        title: topic.title,
        conflict: topic.conflict,
        formula: topic.formula,
        thumbnailConcept: topic.thumbnailConcept,
      };
      project.currentStage = Math.max(project.currentStage, 2);
      project.modelUsed = result.modelUsed;
      await project.save();
    }

    return NextResponse.json({
      success: true,
      scriptText: result.text,
      modelUsed: result.modelUsed,
      provider: result.provider,
      logs: result.logs,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Stage 2 script generation failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
