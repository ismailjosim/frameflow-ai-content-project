/**
 * Voiceover and Scene Timestamps Utility for Doodle Studio / FrameFlow
 * Converts narration scripts into realistic chronological timestamps [MM:SS] / [HH:MM:SS]
 * based on speech pacing (default 135 WPM + conversational pauses).
 */

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `[${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}]`;
  }
  return `[${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}]`;
}

export const TIMESTAMP_REGEX = /^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*/;

export function extractTimestamp(line: string): string | null {
  const match = line.trim().match(TIMESTAMP_REGEX);
  if (!match) return null;
  const raw = match[1];
  return raw.startsWith("[") ? raw : `[${raw}]`;
}

export function stripTimestamp(line: string): string {
  return line.trim().replace(TIMESTAMP_REGEX, "").trim();
}

export interface TimestampsCalculationResult {
  result: string;
  lines: string[];
  count: number;
  totalSec: number;
  formattedRuntime: string;
}

/**
 * Calculates continuous, realistic timestamps across all script lines.
 * Uses 135 WPM standard pacing with natural dramatic pauses.
 */
export function calculateTimestamps(
  text: string,
  wpm = 135,
): TimestampsCalculationResult {
  const rawLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) {
    return {
      result: "",
      lines: [],
      count: 0,
      totalSec: 0,
      formattedRuntime: "00:00",
    };
  }

  let currentSec = 0.0;
  const outputLines: string[] = [];

  for (const raw of rawLines) {
    const cleanText = stripTimestamp(raw);
    if (!cleanText) continue;

    const ts = formatTime(currentSec);
    outputLines.push(`${ts} ${cleanText}`);

    const words = cleanText.split(/\s+/).filter((w) => w.length > 0).length;
    let duration = words / (wpm / 60.0);

    // Natural pauses for YouTube educational/storytelling pacing
    if (words <= 4) {
      duration += 1.0; // short punchline pause
    } else if (cleanText.endsWith("?") || cleanText.endsWith("!")) {
      duration += 1.1; // curiosity or shock pause
    } else {
      duration += 0.8; // standard sentence transition
    }

    currentSec += Math.max(duration, 2.0); // minimum 2 seconds per scene
  }

  const totalSec = Math.floor(currentSec);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const formattedRuntime = `${mins}m ${secs}s`;

  return {
    result: outputLines.join("\n"),
    lines: outputLines,
    count: outputLines.length,
    totalSec,
    formattedRuntime,
  };
}

/**
 * Checks whether the text already contains timestamps on most lines.
 */
export function hasValidTimestamps(text: string): boolean {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return false;
  const timestampedCount = lines.filter((l) => TIMESTAMP_REGEX.test(l)).length;
  return timestampedCount / lines.length >= 0.7; // At least 70% lines have timestamps
}

/**
 * Ensures the script text is timestamped. If already timestamped, preserves existing.
 * If raw script, calculates continuous timestamps across the whole script.
 */
export function ensureTimestampedScript(text: string, wpm = 135): string {
  if (!text || text.trim().length === 0) return "";
  if (hasValidTimestamps(text)) {
    return text.trim();
  }
  return calculateTimestamps(text, wpm).result;
}

/**
 * Post-processes generated prompts to align their timestamps with input batch lines.
 * If the model hallucinated [00:00] repeatedly across batches, this restores
 * the true chronological timestamp from the corresponding batchLine.
 */
export function alignBatchPromptsWithInputTimestamps(
  promptsText: string,
  batchLines: string[],
): string {
  if (!promptsText || !batchLines || batchLines.length === 0) {
    return promptsText;
  }

  // Split prompts by double newline or prompt boundary
  const prompts = promptsText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (prompts.length === 0) return promptsText;

  const alignedPrompts: string[] = prompts.map((prompt, index) => {
    const inputLine = batchLines[index];
    if (!inputLine) return prompt;

    const expectedTs = extractTimestamp(inputLine);
    if (!expectedTs) return prompt;

    // Check if the prompt already has a timestamp
    const promptTs = extractTimestamp(prompt);
    if (promptTs === expectedTs) {
      return prompt; // Already perfectly matched
    }

    if (promptTs) {
      // Replace mismatched timestamp (e.g. [00:00] -> [03:45])
      return prompt.replace(TIMESTAMP_REGEX, `${expectedTs} `);
    }

    // If prompt had no timestamp at all, prepend it
    return `${expectedTs} ${prompt}`;
  });

  return alignedPrompts.join("\n\n");
}
