export type DocumentSummary = {
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type SaveState = "idle" | "saving" | "saved" | "error";
