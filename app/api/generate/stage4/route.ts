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
    const { projectId, topicTitle, scriptSummary, model } = await req.json();

    if (!topicTitle) {
      return NextResponse.json(
        {
          success: false,
          error: "topicTitle is required for Stage 4 Packaging.",
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

    const systemPrompt = preset.stage4Prompt.replace(
      /{{aspectRatio}}/g,
      preset.aspectRatio || "--ar 16:9 --v 6.1",
    );

    const userPrompt = `VIDEO TOPIC: "${topicTitle}"
SUMMARY OF SCRIPT: "${(scriptSummary || topicTitle).slice(0, 1500)}"

Generate YouTube viral metadata. Return ONLY valid JSON with viralTitle, thumbnailPrompt, description, hashtags, and seoTags.`;

    const result = await executeAIRequest(
      userId,
      {
        systemPrompt,
        userPrompt,
        jsonMode: true,
        temperature: 0.7,
      },
      model || project?.modelSelected || "auto",
    );

    // Clean JSON response
    let cleanJson = result.text.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsedPackaging: Record<string, string> = {};
    try {
      parsedPackaging = JSON.parse(cleanJson);
    } catch {
      parsedPackaging = {
        viralTitle: topicTitle,
        thumbnailPrompt: "",
        description: cleanJson,
        hashtags: "",
        seoTags: "",
      };
    }

    // Prepare human-readable plain text format for easy copy and export
    const packagingText = `=========================================
YOUTUBE VIRAL PACKAGING & SEO
Topic: ${topicTitle}
=========================================

1. VIRAL TITLE:
${parsedPackaging.viralTitle || topicTitle}

2. THUMBNAIL PROMPT (Midjourney / Flux):
${parsedPackaging.thumbnailPrompt || ""}

3. DESCRIPTION:
${parsedPackaging.description || ""}

4. HASHTAGS:
${parsedPackaging.hashtags || ""}

5. SEO TAGS:
${parsedPackaging.seoTags || ""}
`;

    if (projectId && project) {
      project.stageData.packagingText = packagingText;
      project.stageData.parsedPackaging = parsedPackaging;
      project.currentStage = 4;
      project.status = "completed";
      project.modelUsed = result.modelUsed;
      await project.save();
    }

    return NextResponse.json({
      success: true,
      packagingText,
      parsedPackaging,
      modelUsed: result.modelUsed,
      provider: result.provider,
      logs: result.logs,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Stage 4 packaging generation failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
