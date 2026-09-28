"use client";

import { Lightbulb } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { IgnoredTopicsBar } from "./IgnoredTopicsBar";
import type {
  IgnoredTopicItem,
  Stage1TopicProps,
  TopicCandidate,
} from "./stage1.types";
import { TopicCandidateGrid } from "./TopicCandidateGrid";
import { TopicHeroPriorityCard } from "./TopicHeroPriorityCard";
import { TopicInputHeader } from "./TopicInputHeader";

export function Stage1Topic({
  projectId,
  selectedModel,
  onTopicSelected,
  currentTopic = "",
}: Stage1TopicProps) {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<TopicCandidate[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [modelUsed, setModelUsed] = useState<string>("");
  const [ignoredTopics, setIgnoredTopics] = useState<IgnoredTopicItem[]>([]);
  const [showIgnoredList, setShowIgnoredList] = useState(false);

  // Fetch creator's ignored topics list
  const fetchIgnoredTopics = useCallback(async () => {
    try {
      const res = await fetch("/api/topics/ignored");
      const data = await res.json();
      if (data.success && Array.isArray(data.ignoredTopics)) {
        setIgnoredTopics(data.ignoredTopics);
      }
    } catch {
      // silently handle
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/topics/ignored");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.ignoredTopics)) {
          setIgnoredTopics(data.ignoredTopics);
        }
      } catch {
        // silently handle
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const generateTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate/stage1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          nicheOrKeyword: keyword,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate topics");
      }

      setCandidates(Array.isArray(data.topics) ? data.topics : []);
      setModelUsed(data.modelUsed || selectedModel);
      if (data.logs) setLogs(data.logs);
      await fetchIgnoredTopics();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown generation error");
    } finally {
      setLoading(false);
    }
  };

  const handleIgnoreTopic = async (cand: TopicCandidate) => {
    // Optimistically remove from current view
    setCandidates((prev) => {
      const remaining = prev.filter((c) => c.title !== cand.title);
      // If the top pick was removed, promote next candidate
      if (cand.isTopPick && remaining.length > 0) {
        remaining[0].isTopPick = true;
        remaining[0].priorityRank = 1;
      }
      return remaining;
    });

    try {
      await fetch("/api/topics/ignored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: cand.title,
          reason: "already_created",
        }),
      });
      await fetchIgnoredTopics();
    } catch {
      // silently handle
    }
  };

  const handleUnignore = async (title: string) => {
    setIgnoredTopics((prev) =>
      prev.filter((item) => item.topicTitle !== title),
    );
    try {
      await fetch(`/api/topics/ignored?title=${encodeURIComponent(title)}`, {
        method: "DELETE",
      });
      await fetchIgnoredTopics();
    } catch {
      // silently handle
    }
  };

  const topPick = candidates.find((c) => c.isTopPick);
  const otherCandidates = candidates.filter((c) => !c.isTopPick);

  return (
    <div className="space-y-6">
      {/* Intro & Input Box */}
      <TopicInputHeader
        keyword={keyword}
        setKeyword={setKeyword}
        loading={loading}
        error={error}
        modelUsed={modelUsed}
        onGenerate={generateTopics}
        ignoredCount={ignoredTopics.length}
        onToggleIgnoredList={() => setShowIgnoredList((p) => !p)}
      />

      {/* Ignored & Covered Topics Management Drawer */}
      <IgnoredTopicsBar
        ignoredTopics={ignoredTopics}
        isOpen={showIgnoredList}
        onToggle={() => setShowIgnoredList((p) => !p)}
        onUnignore={handleUnignore}
      />

      {/* Failover Execution Logs */}
      {logs.length > 1 && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-[#58E6F7]">
            Model Orchestrator Trace:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-300">
              ↳ {log}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Loading Skeleton */}
      {loading && <GenerationSkeleton stage="topic" />}

      {/* Generated Candidates Cards with Data-Backed Priority Highlight */}
      {candidates.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                Viral Angle Analysis & Priority Ranking
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated against YouTube audience retention patterns, curiosity
                gap indices, and mobile CTR readability.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-purple-950/70 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 shadow-xs">
              {candidates.length} Angles Active
            </span>
          </div>

          {/* 1. TOP PRIORITIZED HERO CARD */}
          {topPick && (
            <TopicHeroPriorityCard
              topPick={topPick}
              currentTopic={currentTopic}
              onTopicSelected={onTopicSelected}
              onIgnoreTopic={handleIgnoreTopic}
            />
          )}

          {/* 2. OTHER RANKED ANGLES */}
          <TopicCandidateGrid
            candidates={otherCandidates}
            currentTopic={currentTopic}
            onTopicSelected={onTopicSelected}
            onIgnoreTopic={handleIgnoreTopic}
          />
        </div>
      )}
    </div>
  );
}

export default Stage1Topic;
