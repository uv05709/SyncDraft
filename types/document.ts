export type DocumentSummary = {
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type SaveState = "idle" | "saving" | "saved" | "error";

export type RevisionSummary = {
  id: string;
  documentId: string;
  content: string;
  createdAt: string;
  updatedBy: string | null;
};
