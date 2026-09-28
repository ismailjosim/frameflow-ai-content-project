import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { executeAIRequest } from "@/lib/ai/router";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import {
  ensureDefaultPresets,
  FRAMEFLOW_DEFAULT_PRESET,
} from "@/lib/presets/default-presets";
import { alignBatchPromptsWithInputTimestamps } from "@/lib/timestamps";
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
    const {
      projectId,
      batchLines,
      topicTitle,
      batchIndex,
      totalBatches,
      model,
    } = await req.json();

    if (!batchLines || !Array.isArray(batchLines) || batchLines.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "batchLines array is required for Stage 3 generation.",
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
        FRAMEFLOW_DEFAULT_PRESET;
    }

    // Prepare system prompt with dynamic visual rules and aspect ratio replacement
    const systemPrompt = preset.stage3Prompt
      .replace(/{{visualStyleRules}}/g, preset.visualStyleRules)
      .replace(/{{aspectRatio}}/g, preset.aspectRatio || "--ar 16:9 --v 6.1");

    const userPrompt = `VIDEO TOPIC: "${topicTitle || project?.title || "Prehistoric Survival"}"
BATCH: ${batchIndex + 1} of ${totalBatches || 1}

CRITICAL TIMESTAMP INSTRUCTIONS:
- Each line in the list below has a chronological timestamp (e.g. [01:45]).
- You MUST PRESERVE the exact timestamp from each line at the beginning of each generated prompt.
- DO NOT reset timestamps to [00:00] for new batches.
- Output exactly ONE prompt per input line, matching its exact chronological timestamp, separated by a blank line.

INPUT TIMESTAMPS:
${batchLines.join("\n")}

Output the prompts now:`;

    const result = await executeAIRequest(
      userId,
      {
        systemPrompt,
        userPrompt,
        temperature: 0.65,
        maxTokens: 5000,
      },
      model || project?.modelSelected || "auto",
    );

    // Auto-align prompts to guarantee exact chronological timestamps matching batchLines
    const alignedPrompts = alignBatchPromptsWithInputTimestamps(
      result.text,
      batchLines,
    );

    return NextResponse.json({
      success: true,
      batchIndex,
      promptsText: alignedPrompts,
      modelUsed: result.modelUsed,
      provider: result.provider,
      logs: result.logs,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Stage 3 batch generation failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
