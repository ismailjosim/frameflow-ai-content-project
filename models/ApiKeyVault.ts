import mongoose, { type Document, type Model, Schema } from "mongoose";

export type AIProvider =
  | "gemini"
  | "claude"
  | "openai"
  | "meta"
  | "xai"
  | "deepseek"
  | "qwen"
  | "zai"
  | "mistral"
  | "cohere"
  | string;

export interface IApiKeyVault extends Document {
  userId: mongoose.Types.ObjectId | string;
  provider: AIProvider;
  ciphertext: string;
  iv: string;
  authTag: string;
  maskedKey: string;
  isActive: boolean;
  preferredModel?: string;
  lastTested?: Date;
  statusMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeyVaultSchema = new Schema<IApiKeyVault>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    provider: {
      type: String,
      required: true,
    },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    maskedKey: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    preferredModel: { type: String },
    lastTested: { type: Date },
    statusMessage: { type: String },
  },
  { timestamps: true },
);

ApiKeyVaultSchema.index({ userId: 1, provider: 1 }, { unique: true });

export const ApiKeyVault: Model<IApiKeyVault> =
  mongoose.models.ApiKeyVault ||
  mongoose.model<IApiKeyVault>("ApiKeyVault", ApiKeyVaultSchema);

export default ApiKeyVault;
