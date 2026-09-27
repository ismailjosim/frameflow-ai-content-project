export interface TopicCandidate {
  id: number;
  title: string;
  formula: string;
  conflict: string;
  thumbnailConcept: string;
  viralScore?: number;
  isTopPick?: boolean;
  priorityRank?: number;
  viralRationale?: string;
  audienceDemand?: string;
}

export interface ParsedPackaging {
  viralTitle?: string;
  thumbnailPrompt?: string;
  description?: string;
  hashtags?: string;
  seoTags?: string;
  [key: string]: string | undefined;
}

export interface StageStep {
  num: number;
  label: string;
  done: boolean;
  unlocked: boolean;
}

export interface StudioProjectState {
  id: string;
  title: string;
  selectedModel: string;
  activeStage: number;
  topicDetails: TopicCandidate;
  scriptText: string;
  timestampInput: string;
  promptsText: string;
  packagingText: string;
  parsedPackaging: ParsedPackaging;
}
