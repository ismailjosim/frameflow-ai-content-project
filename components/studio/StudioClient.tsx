"use client";

import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Stage1Topic } from "@/components/stage1";
import { Stage2Script } from "@/components/stage2";
import { Stage3Prompts } from "@/components/stage3";
import { Stage4Packaging } from "@/components/stage4";
import { useStudioProject } from "@/hooks";
import { StudioHeader } from "./StudioHeader";
import { StudioStepper } from "./StudioStepper";

export function StudioClient() {
  const {
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
  } = useStudioProject();

  return (
    <DashboardLayout
      currentModel={selectedModel}
      onModelChange={setSelectedModel}
      activeProjectTitle={projectTitle}
      pageTitle="Studio Pipeline"
    >
      <div className="space-y-6">
        {/* Project Header & Controls */}
        <StudioHeader
          projectTitle={projectTitle}
          onTitleChange={setProjectTitle}
          onTitleBlur={saveProjectState}
          isSaving={isSaving}
          saveStatus={saveStatus}
          onSave={saveProjectState}
        />

        {/* 4-Stage Stepper Bar with Prerequisite Stage Locking */}
        <StudioStepper
          stages={stages}
          activeStage={activeStage}
          onSelectStage={setActiveStage}
        />

        {/* Active Stage Screen */}
        {loadingProject ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            Loading project state from database...
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            {activeStage === 1 && (
              <Stage1Topic
                projectId={projectId}
                selectedModel={selectedModel}
                onTopicSelected={handleTopicSelected}
                currentTopic={topicDetails.title}
              />
            )}

            {activeStage === 2 && (
              <Stage2Script
                projectId={projectId}
                topicTitle={topicDetails.title || projectTitle}
                topicConflict={topicDetails.conflict}
                topicFormula={topicDetails.formula}
                selectedModel={selectedModel}
                scriptText={scriptText}
                autoStart={autoStartScript}
                onScriptChange={(newScript) => {
                  setScriptText(newScript);
                  saveProjectState();
                }}
                onProceedToStage3={handleProceedToStage3}
              />
            )}

            {activeStage === 3 && (
              <Stage3Prompts
                projectId={projectId}
                topicTitle={topicDetails.title || projectTitle}
                selectedModel={selectedModel}
                timestampInput={timestampInput}
                scriptText={scriptText}
                autoStart={autoStartPrompts}
                onTimestampChange={(newVal) => {
                  setTimestampInput(newVal);
                  saveProjectState();
                }}
                promptsText={promptsText}
                onPromptsChange={(newVal) => {
                  setPromptsText(newVal);
                  saveProjectState();
                }}
                onProceedToStage4={handleProceedToStage4}
              />
            )}

            {activeStage === 4 && (
              <Stage4Packaging
                projectId={projectId}
                topicTitle={topicDetails.title || projectTitle}
                scriptSummary={scriptText.slice(0, 1000)}
                selectedModel={selectedModel}
                packagingText={packagingText}
                parsedPackaging={parsedPackaging}
                autoStart={autoStartPackaging}
                onPackagingChange={(text, parsed) => {
                  setPackagingText(text);
                  setParsedPackaging(parsed);
                  saveProjectState();
                }}
                scriptText={scriptText}
                promptsText={promptsText}
                timestampInput={timestampInput}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudioClient;
