import { nanoid } from "nanoid";
import { connectToDatabase } from "@/lib/mongodb";
import { DocumentModel } from "@/models/Document";
import { RevisionModel } from "@/models/Revision";
import type { DocumentSummary } from "@/types/document";

type DocumentLean = {
  documentId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

function serialize(doc: {
  documentId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}): DocumentSummary {
  return {
    documentId: doc.documentId,
    title: doc.title,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

export async function listRecentDocuments(limit = 12) {
  await connectToDatabase();
  const docs = (await DocumentModel.find()
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean()) as unknown as DocumentLean[];

  return docs.map((doc) => serialize(doc));
}

export async function createDocument(input?: { title?: string }) {
  await connectToDatabase();

  const title = input?.title?.trim() || "Untitled Document";
  const documentId = nanoid(12);

  const doc = await DocumentModel.create({
    documentId,
    title
  });

  return serialize({
    documentId: doc.documentId,
    title: doc.title,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  });
}

export async function getDocumentById(documentId: string) {
  await connectToDatabase();
  const doc = (await DocumentModel.findOne({ documentId }).lean()) as
    | DocumentLean
    | null;
  if (!doc) {
    return null;
  }

  return serialize(doc);
}

export async function ensureDocument(documentId: string) {
  const found = await getDocumentById(documentId);
  if (found) {
    return found;
  }

  await connectToDatabase();
  const now = new Date();
  const created = (await DocumentModel.findOneAndUpdate(
    { documentId },
    {
      $setOnInsert: {
        documentId,
        title: "Untitled Document",
        createdAt: now,
        updatedAt: now
      }
    },
    { upsert: true, new: true }
  ).lean()) as DocumentLean | null;

  if (!created) {
    throw new Error("Failed to create document");
  }

  return serialize(created);
}

export async function updateDocument(
  documentId: string,
  payload: { title?: string; touch?: boolean }
) {
  await connectToDatabase();

  const updates: Record<string, unknown> = {};
  if (typeof payload.title === "string" && payload.title.trim().length > 0) {
    updates.title = payload.title.trim().slice(0, 140);
  }
  if (payload.touch) {
    updates.updatedAt = new Date();
  }

  const doc = (await DocumentModel.findOneAndUpdate(
    { documentId },
    {
      $set: updates
    },
    { new: true }
  ).lean()) as DocumentLean | null;

  if (!doc) {
    return null;
  }

  return serialize(doc);
}

export async function deleteDocument(documentId: string) {
  await connectToDatabase();

  const deletedDoc = (await DocumentModel.findOneAndDelete({
    documentId
  }).lean()) as DocumentLean | null;

  if (!deletedDoc) {
    return null;
  }

  const revisionsResult = await RevisionModel.deleteMany({ documentId });

  return {
    document: serialize(deletedDoc),
    deletedRevisions: revisionsResult.deletedCount ?? 0
  };
}
