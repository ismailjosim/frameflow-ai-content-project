import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IIgnoredTopic extends Document {
  userId: string;
  topicTitle: string;
  normalizedTitle: string;
  reason?: string;
  createdAt: Date;
}

const IgnoredTopicSchema = new Schema<IIgnoredTopic>(
  {
    userId: { type: String, required: true, index: true },
    topicTitle: { type: String, required: true, trim: true },
    normalizedTitle: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ["already_created", "not_interested", "repetitive", "other"],
      default: "already_created",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

IgnoredTopicSchema.index({ userId: 1, normalizedTitle: 1 }, { unique: true });

const IgnoredTopic: Model<IIgnoredTopic> =
  mongoose.models.IgnoredTopic ||
  mongoose.model<IIgnoredTopic>("IgnoredTopic", IgnoredTopicSchema);

export default IgnoredTopic;
