"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Sparkles, Users, Zap } from "lucide-react";
import { toast } from "sonner";

const features = [
  {
    icon: Zap,
    title: "Instant sync",
    description: "Every keystroke updates live for everyone in the room."
  },
  {
    icon: Users,
    title: "Presence aware",
    description: "See collaborators active in the same document in real time."
  },
  {
    icon: Sparkles,
    title: "Focused writing UX",
    description: "Clean rich text editing with zero setup friction."
  }
];

export default function Hero() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateFromHero() {
    try {
      setIsCreating(true);
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Untitled Document"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const data = (await response.json()) as {
        document: { documentId: string };
      };
      router.push(`/doc/${data.document.documentId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not create a document right now.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/90 to-blue-100/80 p-8 shadow-soft sm:p-10 lg:p-14">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-200/50 blur-3xl" />

      <div className="relative">
        <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800">
          Hackathon-ready collaborative editor
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          SyncDraft
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
          Real-time collaborative writing for teams. Create, edit, and share
          documents instantly with synchronized presence and rich text editing.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateFromHero}
            disabled={isCreating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-brand-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreating ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isCreating ? "Creating..." : "Create Document"}
          </button>
          <a
            href="#recent-documents"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View recent docs
          </a>
        </div>

        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Built for live hackathon demos and fast team collaboration
        </p>
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-sky-100 text-brand-700">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
