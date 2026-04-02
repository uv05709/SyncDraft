"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Check, Clock3, Copy, FileText, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { DocumentSummary } from "@/types/document";

type RecentDocsListProps = {
  documents: DocumentSummary[];
};

export default function RecentDocsList({ documents }: RecentDocsListProps) {
  const router = useRouter();
  const [items, setItems] = useState(documents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [savingTitleId, setSavingTitleId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(documents);
  }, [documents]);

  async function copyDocId(documentId: string) {
    try {
      await navigator.clipboard.writeText(documentId);
      toast.success("Document ID copied");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy document ID");
    }
  }

  function startEditing(document: DocumentSummary) {
    setEditingId(document.documentId);
    setDraftTitle(document.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setDraftTitle("");
  }

  async function saveTitle(documentId: string) {
    const nextTitle = draftTitle.trim().slice(0, 140);
    if (!nextTitle) {
      toast.error("Title cannot be empty");
      return;
    }

    setSavingTitleId(documentId);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: nextTitle })
      });

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      const data = (await response.json()) as { document: DocumentSummary };

      setItems((prev) =>
        prev.map((item) =>
          item.documentId === documentId ? data.document : item
        )
      );
      cancelEditing();
      router.refresh();
      toast.success("Title updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update title");
    } finally {
      setSavingTitleId(null);
    }
  }

  async function deleteDoc(documentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(documentId);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setItems((prev) => prev.filter((item) => item.documentId !== documentId));
      if (editingId === documentId) {
        cancelEditing();
      }
      router.refresh();
      toast.success("Document deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete document");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Recent Documents</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          {items.length} total
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/60 px-5 py-12 text-center">
          <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800">No documents yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first shared document to start collaborating.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((doc) => (
            <li key={doc.documentId}>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3 transition hover:border-brand-300 hover:bg-blue-50/30 hover:shadow-sm">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-sky-100 text-brand-700">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  {editingId === doc.documentId ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        value={draftTitle}
                        maxLength={140}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void saveTitle(doc.documentId);
                          }
                          if (event.key === "Escape") {
                            event.preventDefault();
                            cancelEditing();
                          }
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 outline-none ring-brand-300 transition focus:border-brand-300 focus:ring"
                        aria-label="Edit document title"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => void saveTitle(doc.documentId)}
                        disabled={savingTitleId === doc.documentId}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                        aria-label="Save title"
                        title="Save title"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={savingTitleId === doc.documentId}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                        aria-label="Cancel editing"
                        title="Cancel editing"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={`/doc/${doc.documentId}`}
                      className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {doc.title}
                    </Link>
                  )}
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Updated{" "}
                    {formatDistanceToNow(new Date(doc.updatedAt), {
                      addSuffix: true
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {editingId !== doc.documentId ? (
                    <button
                      type="button"
                      onClick={() => startEditing(doc)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                      aria-label="Edit title"
                      title="Edit title"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => copyDocId(doc.documentId)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
                    aria-label="Copy document ID"
                    title="Copy document ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => void deleteDoc(doc.documentId)}
                    disabled={deletingId === doc.documentId}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    aria-label="Delete document"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
