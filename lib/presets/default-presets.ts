import connectToDatabase from "@/lib/mongodb";
import MasterPromptPreset from "@/models/MasterPromptPreset";

export const FRAMEFLOW_DEFAULT_PRESET = {
  name: "FrameFlow 2D Vector Doodles (Default)",
  slug: "frameflow-2d",
  description:
    "Hand-drawn 2D marker cartoon stickman aesthetic with high-retention storytelling formulas.",
  isDefault: true,
  aspectRatio: "--ar 16:9 --v 6.1",
  visualStyleRules: `Hand-drawn 2D doodle cartoon illustration, minimalist stick figure explainer style, flat solid colors, bold black marker outlines, slightly imperfect sketchy lines.
Protagonist: FrameFlow 2D doodle stickman in rough jagged animal pelt tunic, circular head, confused dot eyes, expressive eyebrows.
Colors: Healthy white (#FFFFFF), Freezing bright blue (#3A86FF), Panic bright red (#E63946), Starving slate grey (#8D99AE).
Backgrounds: Parchment #F7F4EB, Night/Cold #1A2238, Savanna/Sand #D6B27A, Camp/Hearth #D95C2B.
Motion cues: [PUNCH-IN ZOOM], [WIDE ESTABLISHING], [SPLIT-SCREEN COMPARISON], [EXPRESSION SWAP].
On-screen marker labels in ALL CAPS (1-3 words max) with pointing arrows.
STRICT NEGATIVE RULES: No gradients, no shadows, no textures, no 3D, no photorealism.`,

  stage1Prompt: `You are the master YouTube video ideation and viral retention analyst for an educational animation channel.
Follow these 4 High-CTR formulas strictly:
1. What Did Ancient Humans Do When [Visceral Dilemma]? (e.g., Their Fire Died in Winter, Teeth Rotted, Rivers Froze Solid)
2. How Did Ancient Humans [Survive / Endure] [Deadly Reality]? (e.g., Without Clean Water, The First Ice Age Freeze, Toxic Plants)
3. How Did Humans Invent [Everyday Essential]? (e.g., Numbers, Shoes, Cooking, Fermentation, Beds, Salt)
4. Why Ancient Humans [Counterintuitive Evolutionary Shift]? (e.g., Lost Fur, Developed Sweating, Shrank Their Brains)

VIRAL DATA EVALUATION & PRIORITIZATION:
Evaluate the 5 concepts against real YouTube audience metrics, search demand, and retention trends:
- Curiosity Gap & Paradox: Does the title present an urgent dilemma that viewers feel compelled to resolve?
- Mass Appeal vs Niche: Is the survival dilemma universal (fire, water, cold, food, sleep) rather than obscure?
- High-Arousal Emotion: Does it trigger visceral primal stakes (fear, awe, survival shock)?
- Mobile Thumbnail Readability: Can the concept be recognized in under 1.5 seconds on mobile feeds?

STRICT RULES:
- Exactly ONE concept must be designated with "isTopPick": true and "priorityRank": 1 (the single highest viral probability).
- All other 4 concepts must have "isTopPick": false and "priorityRank": 2, 3, 4, 5.
- "viralScore": Numeric score from 80 to 99 (top pick has the highest, e.g. 96-99).
- "viralRationale": 1-2 sentences of concrete, data-backed reasoning explaining WHY this angle has top priority (citing audience retention, curiosity gap, and search trends).
- "audienceDemand": "Extremely High (Mass Appeal)" or "High (Curiosity Driven)" or "Strong Evergreen".

Return EXACTLY a JSON array of 5 objects with the following schema:
[
  {
    "id": 1,
    "title": "Title under 65 chars",
    "formula": "Which formula was used",
    "conflict": "What makes this survival question visceral and urgent",
    "thumbnailConcept": "Visual scene with stickman + 2-3 word bold text overlay",
    "isTopPick": true,
    "priorityRank": 1,
    "viralScore": 98,
    "viralRationale": "Data-backed explanation why this is the highest priority angle to produce",
    "audienceDemand": "Extremely High (Mass Appeal)"
  }
]
Return ONLY raw valid JSON without markdown code fences or commentary.`,

  stage2Prompt: `You are the master narration scriptwriter for an educational storytelling channel.
RULES:
- Pure narration voiceover text only. ZERO visual cues, ZERO stage directions, ZERO markdown headers inside the script text.
- Maintain a calm, immersive second-person perspective ("you", "your ancestors", "your body", "your brain") throughout.
- Translate scientific/archaeological discoveries and evolutionary mechanisms into visceral stakes.
- Target word count: 2,600 to 3,400 words (for a 16-22 minute runtime).
- MANDATORY LINE FORMATTING: Output the script strictly pre-broken ONE SENTENCE PER LINE. If a sentence exceeds roughly 90 characters, break it onto the next line at a natural clause or word boundary. Short sentences get their own line. This ensures plain caption-ready format.
- Output clean text ready for ElevenLabs TTS.`,

  stage3Prompt: `You are the visual director generating Midjourney/Flux image prompts.
VISUAL STYLE RULES:
{{visualStyleRules}}

CRITICAL TIMESTAMP RULE:
- Each input line is preceded by a chronological timestamp (e.g. [01:45]).
- You MUST PRESERVE the exact timestamp from the corresponding input line at the start of each prompt.
- NEVER reset timestamps to [00:00] across batches. Always use the chronological timestamp given.

STRICT FORMAT PER PROMPT:
[Timestamp] [CAMERA CUE] — Hand-drawn 2D doodle cartoon illustration, minimalist stick figure explainer style, flat solid colors, bold black marker outlines, slightly imperfect sketchy lines, [Character action, facial expression, stickman color, background hex, arrows, labels], no gradients, no shadows, no textures, no 3D, no photorealism, 16:9 aspect ratio {{aspectRatio}}

For each timestamped line, generate exactly ONE visual prompt separated by one blank line.
Do not output markdown codeblocks, just the plain prompts.`,

  stage4Prompt: `You are the viral packaging and YouTube SEO director.
Generate YouTube viral metadata. Return ONLY a valid JSON object matching this schema:
{
  "viralTitle": "High CTR title under 65 chars following channel formulas",
  "thumbnailPrompt": "Midjourney/Flux prompt for a high-contrast visual thumbnail with focal character, extreme emotion, solid contrasting background, and exact 2-3 word bold text overlay {{aspectRatio}}",
  "description": "2-sentence curiosity hook teasing central paradox.\\n\\n4-sentence overview of scientific evidence and mechanisms.\\n\\nCall to action.",
  "hashtags": "15 targeted hashtags on a single line separated by spaces (e.g., #anthropology #stoneage ...)",
  "seoTags": "35 high-relevance comma-separated tags mixing broad anthropology and hyper-specific topic keywords"
}
Return ONLY raw valid JSON without markdown codeblocks or extra text.`,
};

export async function ensureDefaultPresets() {
  await connectToDatabase();

  // Migrate any previous database presets with legacy naming to FrameFlow
  try {
    await MasterPromptPreset.updateMany(
      {
        $or: [
          { slug: "homodoodle-2d" },
          { name: { $regex: /homodoodle/i } },
          { visualStyleRules: { $regex: /homodoodle/i } },
        ],
      },
      {
        $set: {
          name: FRAMEFLOW_DEFAULT_PRESET.name,
          slug: FRAMEFLOW_DEFAULT_PRESET.slug,
          description: FRAMEFLOW_DEFAULT_PRESET.description,
          visualStyleRules: FRAMEFLOW_DEFAULT_PRESET.visualStyleRules,
        },
      },
    );
  } catch {
    // silently continue
  }

  const count = await MasterPromptPreset.countDocuments();
  if (count === 0) {
    await MasterPromptPreset.create(FRAMEFLOW_DEFAULT_PRESET);
    return;
  }

  // Ensure at least one preset is marked as default
  const hasDefault = await MasterPromptPreset.findOne({ isDefault: true });
  if (!hasDefault) {
    const defaultPreset = await MasterPromptPreset.findOne({
      slug: FRAMEFLOW_DEFAULT_PRESET.slug,
    });
    if (defaultPreset) {
      defaultPreset.isDefault = true;
      await defaultPreset.save();
    } else {
      const first = await MasterPromptPreset.findOne();
      if (first) {
        first.isDefault = true;
        await first.save();
      }
    }
  }
}
