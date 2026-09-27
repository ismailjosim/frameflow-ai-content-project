export interface ProjectItem {
  _id: string;
  title: string;
  topicSlug: string;
  status: "draft" | "in_progress" | "completed";
  currentStage: number;
  modelSelected?: string;
  modelUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCardProps {
  project: ProjectItem;
  onDelete: (id: string) => void;
}

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
