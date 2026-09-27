import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IProjectStageData {
  topic: string;
  topicDetails?: {
    title?: string;
    formula?: string;
    conflict?: string;
    thumbnailConcept?: string;
  };
  targetDuration: string;
  scriptText: string;
  timestampInput: string;
  imagePromptsText: string;
  packagingText: string;
  parsedPackaging?: {
    viralTitle?: string;
    thumbnailPrompt?: string;
    description?: string;
    hashtags?: string;
    seoTags?: string;
  };
}

export interface IProject extends Document {
  title: string;
  topicSlug: string;
  userId: mongoose.Types.ObjectId | string;
  presetId?: mongoose.Types.ObjectId | string;
  modelSelected: string;
  modelUsed?: string;
  currentStage: number;
  status: "draft" | "in_progress" | "completed";
  stageData: IProjectStageData;
  executionLogs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    topicSlug: { type: String, default: "untitled-video" },
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    presetId: { type: Schema.Types.Mixed, ref: "MasterPromptPreset" },
    modelSelected: { type: String, default: "auto" },
    modelUsed: { type: String },
    currentStage: { type: Number, default: 1, min: 1, max: 4 },
    status: {
      type: String,
      enum: ["draft", "in_progress", "completed"],
      default: "draft",
    },
    stageData: {
      topic: { type: String, default: "" },
      topicDetails: {
        formula: { type: String, default: "" },
        conflict: { type: String, default: "" },
        thumbnailConcept: { type: String, default: "" },
      },
      targetDuration: {
        type: String,
        default: "16–22 minutes (2,600–3,400 words)",
      },
      scriptText: { type: String, default: "" },
      timestampInput: { type: String, default: "" },
      imagePromptsText: { type: String, default: "" },
      packagingText: { type: String, default: "" },
      parsedPackaging: {
        viralTitle: { type: String, default: "" },
        thumbnailPrompt: { type: String, default: "" },
        description: { type: String, default: "" },
        hashtags: { type: String, default: "" },
        seoTags: { type: String, default: "" },
      },
    },
    executionLogs: [{ type: String }],
  },
  { timestamps: true },
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
