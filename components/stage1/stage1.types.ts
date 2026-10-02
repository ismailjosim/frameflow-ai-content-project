import type { TopicCandidate } from "@/types";

export type { TopicCandidate };

export interface IgnoredTopicItem {
  _id: string;
  topicTitle: string;
  reason?: string;
  createdAt: string;
}

export interface Stage1TopicProps {
  projectId: string;
  selectedModel: string;
  onTopicSelected: (topic: TopicCandidate) => void;
  currentTopic?: string;
}

export interface TopicInputHeaderProps {
  keyword: string;
  setKeyword: (val: string) => void;
  loading: boolean;
  error: string | null;
  modelUsed: string;
  onGenerate: () => void;
  onStop?: () => void;
  ignoredCount?: number;
  onToggleIgnoredList?: () => void;
}

export interface TopicHeroPriorityCardProps {
  topPick: TopicCandidate;
  currentTopic: string;
  onTopicSelected: (topic: TopicCandidate) => void;
  onIgnoreTopic?: (topic: TopicCandidate) => void;
}

export interface TopicCandidateGridProps {
  candidates: TopicCandidate[];
  currentTopic: string;
  onTopicSelected: (topic: TopicCandidate) => void;
  onIgnoreTopic?: (topic: TopicCandidate) => void;
}

export interface IgnoredTopicsBarProps {
  ignoredTopics: IgnoredTopicItem[];
  isOpen: boolean;
  onToggle: () => void;
  onUnignore: (title: string) => void;
}
