"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePenLine } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  showBackToHome?: boolean;
};

export default function Header({ showBackToHome = false }: HeaderProps) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith("/doc/");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="shell-container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-semibold text-slate-900 transition-colors hover:text-brand-700"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-500 text-white shadow-sm shadow-sky-300/60">
            <FilePenLine className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">SyncDraft</span>
        </Link>

        <nav className="flex items-center gap-2">
          {showBackToHome && isEditorPage ? (
            <Link
              href="/"
              className={cn(
                "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors",
                "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              Back to dashboard
            </Link>
          ) : null}
          <span className="hidden rounded-full border border-brand-200/70 bg-brand-50/80 px-3 py-1.5 text-xs font-semibold text-brand-700 sm:inline-flex">
            Real-time collaboration
          </span>
        </nav>
      </div>
    </header>
  );
}
