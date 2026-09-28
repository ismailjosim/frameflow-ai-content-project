"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { sound } from "@/lib/sound";
import { ensureTimestampedScript } from "@/lib/timestamps";
import type { ParsedPackaging, StageStep, TopicCandidate } from "@/types";

export function useStudioProject() {
  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get("projectId");

  const [activeStage, setActiveStage] = useState(1);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [projectId, setProjectId] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState("Untitled Video Project");
  const [loadingProject, setLoadingProject] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Pipeline Data States
  const [topicDetails, setTopicDetails] = useState<TopicCandidate>({
    id: 1,
    title: "",
    conflict: "",
    formula: "",
    thumbnailConcept: "",
  });

  const [scriptText, setScriptText] = useState("");
  const [timestampInput, setTimestampInput] = useState("");
  const [promptsText, setPromptsText] = useState("");
  const [packagingText, setPackagingText] = useState("");
  const [parsedPackaging, setParsedPackaging] = useState<ParsedPackaging>({});

  // Auto-Start flags for stage progression
  const [autoStartScript, setAutoStartScript] = useState(false);
  const [autoStartPrompts, setAutoStartPrompts] = useState(false);
  const [autoStartPackaging, setAutoStartPackaging] = useState(false);

  // Fetch or initialize project
  useEffect(() => {
    async function initProject() {
      if (urlProjectId) {
        setLoadingProject(true);
        try {
          const res = await fetch(`/api/projects/${urlProjectId}`);
          const data = await res.json();
          if (data.success && data.project) {
            const p = data.project;
            setProjectId(p._id);
            setProjectTitle(p.title);
            setSelectedModel(p.modelSelected || "auto");
            setActiveStage(p.currentStage || 1);

            if (p.stageData) {
              setTopicDetails({
                id: 1,
                title: p.stageData.topic || p.title,
                conflict: p.stageData.topicDetails?.conflict || "",
                formula: p.stageData.topicDetails?.formula || "",
                thumbnailConcept:
                  p.stageData.topicDetails?.thumbnailConcept || "",
              });
              setScriptText(p.stageData.scriptText || "");
              setTimestampInput(p.stageData.timestampInput || "");
              setPromptsText(p.stageData.imagePromptsText || "");
              setPackagingText(p.stageData.packagingText || "");
              if (p.stageData.parsedPackaging) {
                setParsedPackaging(p.stageData.parsedPackaging);
              }
            }
          }
        } catch {
          // ignore
        } finally {
          setLoadingProject(false);
        }
      } else {
        // Auto-create or resume active draft
        try {
          const res = await fetch("/api/projects");
          const data = await res.json();
          if (
            data.success &&
            Array.isArray(data.projects) &&
            data.projects.length > 0
          ) {
            const latest = data.projects[0];
            const singleRes = await fetch(`/api/projects/${latest._id}`);
            const singleData = await singleRes.json();
            if (singleData.success && singleData.project) {
              const p = singleData.project;
              setProjectId(p._id);
              setProjectTitle(p.title);
              setSelectedModel(p.modelSelected || "auto");
              setActiveStage(p.currentStage || 1);
              if (p.stageData) {
                setTopicDetails({
                  id: 1,
                  title: p.stageData.topic || p.title,
                  conflict: p.stageData.topicDetails?.conflict || "",
                  formula: p.stageData.topicDetails?.formula || "",
                  thumbnailConcept:
                    p.stageData.topicDetails?.thumbnailConcept || "",
                });
                setScriptText(p.stageData.scriptText || "");
                setTimestampInput(p.stageData.timestampInput || "");
                setPromptsText(p.stageData.imagePromptsText || "");
                setPackagingText(p.stageData.packagingText || "");
                if (p.stageData.parsedPackaging) {
                  setParsedPackaging(p.stageData.parsedPackaging);
                }
              }
            }
          } else {
            const createRes = await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: "New Video Project" }),
            });
            const createData = await createRes.json();
            if (createData.success && createData.project) {
              setProjectId(createData.project._id);
              setProjectTitle(createData.project.title);
            }
          }
        } catch {
          // ignore
        } finally {
          setLoadingProject(false);
        }
      }
    }

    initProject();
  }, [urlProjectId]);

  // Save changes to cloud library
  const saveProjectState = useCallback(async () => {
    if (!projectId) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          modelSelected: selectedModel,
          currentStage: activeStage,
          stageData: {
            topic: topicDetails.title,
            topicDetails,
            scriptText,
            timestampInput,
            imagePromptsText: promptsText,
            packagingText,
            parsedPackaging,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("All Changes Saved!");
        sound.playNotification();
        toast.success("Project saved successfully!");
        setTimeout(() => setSaveStatus(null), 2500);
      }
    } catch {
      setSaveStatus("Failed to save");
      toast.error("Failed to save project state.");
    } finally {
      setIsSaving(false);
    }
  }, [
    projectId,
    projectTitle,
    selectedModel,
    activeStage,
    topicDetails,
    scriptText,
    timestampInput,
    promptsText,
    packagingText,
    parsedPackaging,
  ]);

  const handleTopicSelected = (cand: TopicCandidate) => {
    setTopicDetails(cand);
    setProjectTitle(cand.title);
    setAutoStartScript(true);
    setActiveStage(2);
    sound.playStepComplete();
    toast.success(`Stage 1 complete! Entering Stage 2 Scriptwriter...`);
    setTimeout(saveProjectState, 300);
  };

  const handleProceedToStage3 = () => {
    const raw = timestampInput?.trim() ? timestampInput : scriptText;
    const timestamped = ensureTimestampedScript(raw);
    setTimestampInput(timestamped);
    setAutoStartPrompts(true);
    setActiveStage(3);
    sound.playStepComplete();
    toast.success(`Stage 2 complete! Entering Stage 3 Batch Image Prompts...`);
    setTimeout(saveProjectState, 300);
  };

  const handleProceedToStage4 = () => {
    setAutoStartPackaging(true);
    setActiveStage(4);
    sound.playStepComplete();
    toast.success(
      `Stage 3 complete! Entering Stage 4 Viral SEO & Packaging...`,
    );
    setTimeout(saveProjectState, 300);
  };

  const stages: StageStep[] = [
    {
      num: 1,
      label: "Topic & Angle",
      done: !!topicDetails.title,
      unlocked: true,
    },
    {
      num: 2,
      label: "Voiceover Script",
      done: !!scriptText,
      unlocked: !!topicDetails.title || activeStage >= 2,
    },
    {
      num: 3,
      label: "Batch Prompts",
      done: !!promptsText,
      unlocked: !!scriptText || activeStage >= 3,
    },
    {
      num: 4,
      label: "Viral Packaging",
      done: !!packagingText,
      unlocked: !!promptsText || activeStage >= 4,
    },
  ];

  return {
    activeStage,
    setActiveStage,
    selectedModel,
    setSelectedModel,
    projectId,
    projectTitle,
    setProjectTitle,
    loadingProject,
    isSaving,
    saveStatus,
    topicDetails,
    setTopicDetails,
    scriptText,
    setScriptText,
    timestampInput,
    setTimestampInput,
    promptsText,
    setPromptsText,
    packagingText,
    setPackagingText,
    parsedPackaging,
    setParsedPackaging,
    autoStartScript,
    autoStartPrompts,
    autoStartPackaging,
    saveProjectState,
    handleTopicSelected,
    handleProceedToStage3,
    handleProceedToStage4,
    stages,
  };
}
