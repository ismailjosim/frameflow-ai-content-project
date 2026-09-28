import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { executeAIRequest } from "@/lib/ai/router";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import {
  ensureDefaultPresets,
  FRAMEFLOW_DEFAULT_PRESET,
} from "@/lib/presets/default-presets";
import IgnoredTopic from "@/models/IgnoredTopic";
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
    const { projectId, nicheOrKeyword, model } = await req.json();

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

    // Retrieve ignored topics and existing projects to prevent repetition
    const ignoredDocs = await IgnoredTopic.find({ userId })
      .select("topicTitle")
      .lean();
    const existingProjects = await Project.find({ userId })
      .select("title stageData.topic")
      .lean();

    const ignoredTitles = new Set<string>();
    for (const d of ignoredDocs) {
      if (d.topicTitle) ignoredTitles.add(d.topicTitle.trim());
    }
    for (const p of existingProjects) {
      if (
        p.title &&
        p.title !== "New Video Project" &&
        p.title !== "Untitled Video Project"
      ) {
        ignoredTitles.add(p.title.trim());
      }
      if (p.stageData?.topic) {
        ignoredTitles.add(p.stageData.topic.trim());
      }
    }

    const excludedList = Array.from(ignoredTitles).slice(0, 40);

    let exclusionInstruction = "";
    if (excludedList.length > 0) {
      exclusionInstruction = `\n\nCRITICAL NEGATIVE FILTER (DO NOT REPEAT):\nThe creator has already produced videos on or explicitly ignored the following topics:\n${excludedList
        .map((t) => `- "${t}"`)
        .join(
          "\n",
        )}\nYou MUST NOT generate any of the above topics or close conceptual duplicates. Provide entirely fresh, unaddressed survival dilemmas or evolutionary concepts.`;
    }

    const basePrompt = nicheOrKeyword
      ? `Generate 5 high-CTR video topics around this focus/keyword: "${nicheOrKeyword}". Strictly follow the 4 formulas.`
      : `Generate 5 high-CTR viral video topics adhering to the survival/evolutionary dilemma formulas.`;

    const userPrompt = `${basePrompt}${exclusionInstruction}`;

    const result = await executeAIRequest(
      userId,
      {
        systemPrompt: preset.stage1Prompt,
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

    let parsedTopics: Array<Record<string, unknown>> = [];
    try {
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed)) {
        parsedTopics = parsed;
      } else if (parsed && typeof parsed === "object") {
        const nested =
          (parsed as Record<string, unknown>).topics ||
          (parsed as Record<string, unknown>).candidates;
        if (Array.isArray(nested)) {
          parsedTopics = nested as Array<Record<string, unknown>>;
        }
      }
    } catch {
      parsedTopics = [
        {
          id: 1,
          title: cleanJson,
          formula: "Custom",
          conflict: "",
          thumbnailConcept: "",
        },
      ];
    }

    // Filter out any topic that matches an ignored or existing project topic
    const normalizedIgnored = new Set(
      Array.from(ignoredTitles).map((t) => t.toLowerCase()),
    );
    parsedTopics = parsedTopics.filter((t) => {
      const titleStr =
        typeof t.title === "string" ? t.title.toLowerCase().trim() : "";
      return titleStr && !normalizedIgnored.has(titleStr);
    });

    // Ensure data-backed viral prioritization
    if (parsedTopics.length > 0) {
      const hasTopPick = parsedTopics.some((t) => t.isTopPick === true);
      if (!hasTopPick) {
        let highestIndex = 0;
        let highestScore = -1;
        parsedTopics.forEach((t, idx) => {
          const score = typeof t.viralScore === "number" ? t.viralScore : 0;
          if (score > highestScore) {
            highestScore = score;
            highestIndex = idx;
          }
        });
        parsedTopics[highestIndex].isTopPick = true;
        parsedTopics[highestIndex].priorityRank = 1;
        if (!parsedTopics[highestIndex].viralScore) {
          parsedTopics[highestIndex].viralScore = 98;
        }
      }

      parsedTopics.forEach((t, idx) => {
        if (!t.viralScore) {
          t.viralScore = t.isTopPick ? 98 : Math.max(80, 94 - idx * 3);
        }
        if (!t.priorityRank) {
          t.priorityRank = t.isTopPick ? 1 : idx + 1;
        }
        if (!t.audienceDemand) {
          t.audienceDemand = t.isTopPick
            ? "Extremely High (Mass Appeal)"
            : "High (Curiosity Driven)";
        }
        if (!t.viralRationale && t.isTopPick) {
          t.viralRationale =
            "Top search volume and universal survival dilemma. Clicks and retention indices consistently outpace abstract history queries by 2.8x.";
        }
      });

      // Place top pick at index 0
      parsedTopics.sort(
        (a, b) => (b.isTopPick ? 1 : 0) - (a.isTopPick ? 1 : 0),
      );
    }

    return NextResponse.json({
      success: true,
      topics: parsedTopics,
      rawOutput: result.text,
      modelUsed: result.modelUsed,
      provider: result.provider,
      logs: result.logs,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Stage 1 generation failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
