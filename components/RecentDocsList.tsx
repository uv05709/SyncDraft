"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock3, Copy, FileText } from "lucide-react";
import { toast } from "sonner";
import type { DocumentSummary } from "@/types/document";

type RecentDocsListProps = {
  documents: DocumentSummary[];
};

export default function RecentDocsList({ documents }: RecentDocsListProps) {
  async function copyDocId(documentId: string) {
    try {
      await navigator.clipboard.writeText(documentId);
      toast.success("Document ID copied");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy document ID");
    }
  }

  return (
    <section className="surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Recent documents</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          {documents.length} total
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-10 text-center">
          <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            No documents yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first document to start collaborating.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {documents.map((doc) => (
            <li key={doc.documentId}>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3 transition hover:border-brand-300 hover:bg-blue-50/30 hover:shadow-sm">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-sky-100 text-brand-700">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/doc/${doc.documentId}`}
                    className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-brand-700"
                  >
                    {doc.title}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Updated{" "}
                    {formatDistanceToNow(new Date(doc.updatedAt), {
                      addSuffix: true
                    })}
                  </div>
                </div>

                <button
                  onClick={() => copyDocId(doc.documentId)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
                  aria-label="Copy document ID"
                  title="Copy document ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
