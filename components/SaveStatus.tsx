"use client";

import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, LoaderCircle, Save } from "lucide-react";
import type { SaveState } from "@/types/document";

type SaveStatusProps = {
  state: SaveState;
  updatedAt?: string;
};

export default function SaveStatus({ state, updatedAt }: SaveStatusProps) {
  if (state === "saving") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        Saving...
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
        <AlertTriangle className="h-3.5 w-3.5" />
        Save failed
      </div>
    );
  }

  if (state === "saved") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Saved
        {updatedAt ? (
          <span className="hidden text-emerald-600 sm:inline">
            at {format(new Date(updatedAt), "p")}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
      <Save className="h-3.5 w-3.5" />
      Draft ready
    </div>
  );
}
