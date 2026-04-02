import { model, models, Schema, type InferSchemaType } from "mongoose";

const revisionSchema = new Schema(
  {
    documentId: {
      type: String,
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    updatedBy: {
      type: String,
      required: false,
      default: null
    }
  },
  {
    timestamps: true
  }
);

revisionSchema.index({ documentId: 1, createdAt: -1 });

export type RevisionRecord = InferSchemaType<typeof revisionSchema>;

export const RevisionModel =
  models.Revision || model("Revision", revisionSchema);
