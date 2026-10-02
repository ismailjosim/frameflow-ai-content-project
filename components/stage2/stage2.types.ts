export interface Stage2ScriptProps {
  projectId: string;
  topicTitle: string;
  topicConflict?: string;
  topicFormula?: string;
  selectedModel: string;
  scriptText: string;
  isScriptComplete?: boolean;
  onScriptCompleteChange?: (complete: boolean) => void;
  onScriptChange: (newScript: string) => void;
  onProceedToStage3: () => void;
  autoStart?: boolean;
}

export interface ScriptStats {
  lines: number;
  words: number;
  longLines: number;
}

export interface Stage2MetricsBarProps {
  stats: ScriptStats;
  scriptText: string;
  isScriptComplete?: boolean;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}
