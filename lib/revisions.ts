import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { RevisionModel } from "@/models/Revision";

export type RevisionSummary = {
  id: string;
  documentId: string;
  content: string;
  createdAt: string;
  updatedBy: string | null;
};

type RevisionLean = {
  _id: { toString: () => string };
  documentId: string;
  content: string;
  createdAt: Date;
  updatedBy?: string | null;
};

function serialize(revision: RevisionLean): RevisionSummary {
  return {
    id: revision._id.toString(),
    documentId: revision.documentId,
    content: revision.content,
    createdAt: revision.createdAt.toISOString(),
    updatedBy: revision.updatedBy ?? null
  };
}

export async function listRevisions(documentId: string, limit = 50) {
  await connectToDatabase();
  const revisions = (await RevisionModel.find({ documentId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()) as unknown as RevisionLean[];

  return revisions.map((revision) => serialize(revision));
}

export async function saveRevisionSnapshot(input: {
  documentId: string;
  content: string;
  updatedBy?: string | null;
}) {
  await connectToDatabase();

  const latest = (await RevisionModel.findOne({ documentId: input.documentId })
    .sort({ createdAt: -1 })
    .lean()) as unknown as RevisionLean | null;

  if (latest && latest.content === input.content) {
    return {
      created: false,
      revision: serialize(latest)
    };
  }

  const created = await RevisionModel.create({
    documentId: input.documentId,
    content: input.content,
    updatedBy: input.updatedBy ?? null
  });

  return {
    created: true,
    revision: serialize({
      _id: created._id,
      documentId: created.documentId,
      content: created.content,
      createdAt: created.createdAt,
      updatedBy: created.updatedBy ?? null
    })
  };
}

export async function restoreRevisionSnapshot(input: {
  documentId: string;
  revisionId: string;
  updatedBy?: string | null;
}) {
  if (!mongoose.Types.ObjectId.isValid(input.revisionId)) {
    return null;
  }

  await connectToDatabase();

  const target = (await RevisionModel.findOne({
    _id: input.revisionId,
    documentId: input.documentId
  }).lean()) as unknown as RevisionLean | null;

  if (!target) {
    return null;
  }

  const restored = await RevisionModel.create({
    documentId: input.documentId,
    content: target.content,
    updatedBy: input.updatedBy ?? null
  });

  return {
    restoredFrom: serialize(target),
    restoredAs: serialize({
      _id: restored._id,
      documentId: restored.documentId,
      content: restored.content,
      createdAt: restored.createdAt,
      updatedBy: restored.updatedBy ?? null
    })
  };
}
