export interface Stage3PromptsProps {
  projectId: string;
  topicTitle: string;
  selectedModel: string;
  timestampInput: string;
  onTimestampChange: (newVal: string) => void;
  promptsText: string;
  onPromptsChange: (newVal: string) => void;
  onProceedToStage4: () => void;
  autoStart?: boolean;
  scriptText?: string;
}

export interface Stage3BatchControlProps {
  isRunning: boolean;
  isPaused?: boolean;
  linesCount: number;
  promptsExist: boolean;
  currentBatch: number;
  totalBatches: number;
  currentPercent: number;
  timestampInput: string;
  onTimestampChange: (val: string) => void;
  onStartQueue: () => void;
  onPauseQueue?: () => void;
  onStopQueue?: () => void;
  onResumeQueue?: (fromBatchIndex: number) => void;
  failedBatchIndex?: number | null;
  onRecalculateTimestamps?: () => void;
  estimatedRuntime?: string;
  error: string | null;
}

export interface Stage3PromptListProps {
  promptList: string[];
  promptsText: string;
  onPromptsChange: (val: string) => void;
  copied: boolean;
  onCopyAll: () => void;
  onDownload: () => void;
}
