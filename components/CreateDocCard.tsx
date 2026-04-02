"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Link2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CreateDocCard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [joinId, setJoinId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    try {
      setIsCreating(true);
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim() || "Untitled Document"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const data = (await response.json()) as {
        document: { documentId: string };
      };
      toast.success("Document created");
      router.push(`/doc/${data.document.documentId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not create a document. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  function handleJoin() {
    if (!joinId.trim()) {
      toast.error("Enter a document ID first");
      return;
    }
    router.push(`/doc/${joinId.trim()}`);
  }

  return (
    <section className="surface p-6">
      <h2 className="text-xl font-semibold text-slate-900">Start collaborating</h2>
      <p className="mt-1 text-sm text-slate-600">
        Create a new doc or join using a shared document ID.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            New document title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={140}
            placeholder="Quarterly Planning Notes"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-brand-300 transition placeholder:text-slate-400 focus:border-brand-300 focus:ring"
          />
        </label>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-brand-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create new document"}
        </button>
      </div>

      <div className="my-6 h-px bg-slate-200" />

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Join by document ID
          </span>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={joinId}
                onChange={(event) => setJoinId(event.target.value)}
                placeholder="e.g. 9h5M1zXfF2Lq"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-brand-300 transition placeholder:text-slate-400 focus:border-brand-300 focus:ring"
              />
            </div>
            <button
              onClick={handleJoin}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              aria-label="Open document"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </label>
      </div>
    </section>
  );
}
