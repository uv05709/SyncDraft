import { model, models, Schema, type InferSchemaType } from "mongoose";

const documentSchema = new Schema(
  {
    documentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    }
  },
  {
    timestamps: true
  }
);

export type DocumentRecord = InferSchemaType<typeof documentSchema>;

export const DocumentModel =
  models.Document || model("Document", documentSchema);
