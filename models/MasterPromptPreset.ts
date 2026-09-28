import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IMasterPromptPreset extends Document {
  name: string;
  slug: string;
  description?: string;
  userId?: mongoose.Types.ObjectId | string | null; // null for system-wide defaults
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  isDefault: boolean;
  visualStyleRules: string;
  stage1Prompt: string;
  stage2Prompt: string;
  stage3Prompt: string;
  stage4Prompt: string;
  aspectRatio: string;
  rawMasterFile?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MasterPromptPresetSchema = new Schema<IMasterPromptPreset>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.Mixed, default: null, index: true },
    userName: { type: String, default: null },
    userEmail: { type: String, default: null },
    userImage: { type: String, default: null },
    isDefault: { type: Boolean, default: false },
    visualStyleRules: { type: String, required: true },
    stage1Prompt: { type: String, required: true },
    stage2Prompt: { type: String, required: true },
    stage3Prompt: { type: String, required: true },
    stage4Prompt: { type: String, required: true },
    aspectRatio: { type: String, default: "--ar 16:9 --v 6.1" },
    rawMasterFile: { type: String },
  },
  { timestamps: true },
);

export const MasterPromptPreset: Model<IMasterPromptPreset> =
  mongoose.models.MasterPromptPreset ||
  mongoose.model<IMasterPromptPreset>(
    "MasterPromptPreset",
    MasterPromptPresetSchema,
  );

export default MasterPromptPreset;
