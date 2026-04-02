"use client";

import { Toolbar as LiveblocksToolbar } from "@liveblocks/react-lexical";

export default function Toolbar() {
  return (
    <div className="flex min-h-11 flex-1 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
      <LiveblocksToolbar>
        <LiveblocksToolbar.SectionInline />
      </LiveblocksToolbar>
      <span className="ml-auto hidden rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 sm:inline">
        Shortcuts: Ctrl/Cmd + B / I / U
      </span>
    </div>
  );
}
