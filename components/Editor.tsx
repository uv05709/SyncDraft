"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  FilePenLine,
  History,
  Link2,
  RefreshCw,
  RotateCcw
} from "lucide-react";
import { format } from "date-fns";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider
} from "@liveblocks/react/suspense";
import {
  FloatingToolbar,
  LiveblocksPlugin,
  liveblocksConfig
} from "@liveblocks/react-lexical";
import { toast } from "sonner";
import type {
  DocumentSummary,
  RevisionSummary,
  SaveState
} from "@/types/document";
import PresenceAvatars from "@/components/PresenceAvatars";
import SaveStatus from "@/components/SaveStatus";
import Toolbar from "@/components/Toolbar";

type EditorProps = {
  document: DocumentSummary;
};

type RevisionLoadPayload = {
  content: string;
};

const editorTheme = {
  paragraph: "mb-3",
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline underline-offset-2 decoration-2"
  },
  heading: {
    h1: "text-3xl font-bold tracking-tight mb-4",
    h2: "text-2xl font-semibold mb-3"
  }
};

const initialConfig = liveblocksConfig({
  namespace: "SyncDraftEditor",
  theme: editorTheme,
  onError: (error: unknown) => {
    console.error(error);
    throw error;
  }
});

function RevisionLoader({
  payload,
  onApplied
}: {
  payload: RevisionLoadPayload | null;
  onApplied?: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!payload?.content) {
      return;
    }
    try {
      const parsed = editor.parseEditorState(payload.content);
      editor.setEditorState(parsed);
      onApplied?.();
    } catch (error) {
      console.error(error);
      toast.error("Could not load this revision");
    }
  }, [editor, payload, onApplied]);

  return null;
}

function RevisionHistoryPanel({
  revisions,
  selectedRevisionId,
  onSelectRevision,
  onRestoreRevision,
  onRefresh,
  isLoading,
  isRestoring
}: {
  revisions: RevisionSummary[];
  selectedRevisionId: string | null;
  onSelectRevision: (revision: RevisionSummary) => void;
  onRestoreRevision: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isRestoring: boolean;
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-blue-50 text-slate-700">
            <History className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">History</h3>
            <p className="text-xs text-slate-500">Revision snapshots</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="Refresh revisions"
          title="Refresh revisions"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onRestoreRevision}
        disabled={!selectedRevisionId || isRestoring}
        className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:from-slate-800 hover:to-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {isRestoring ? "Restoring..." : "Restore Selected"}
      </button>

      <div className="max-h-[420px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : revisions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-8 text-center text-xs text-slate-500">
            No revisions yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {revisions.map((revision) => {
              const isSelected = selectedRevisionId === revision.id;
              return (
                <li key={revision.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRevision(revision)}
                    className={[
                      "w-full rounded-xl border px-3 py-2 text-left transition duration-150",
                      isSelected
                        ? "border-brand-300 bg-gradient-to-r from-brand-50 to-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    ].join(" ")}
                  >
                    <p className="text-xs font-semibold text-slate-900">
                      {format(new Date(revision.createdAt), "MMM d, yyyy")}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {format(new Date(revision.createdAt), "p")}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

function EditorCanvas({
  documentId,
  initialTitle,
  initialUpdatedAt
}: {
  documentId: string;
  initialTitle: string;
  initialUpdatedAt: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [revisions, setRevisions] = useState<RevisionSummary[]>([]);
  const [isRevisionsLoading, setIsRevisionsLoading] = useState(false);
  const [isRestoringRevision, setIsRestoringRevision] = useState(false);
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(
    null
  );
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [revisionLoadPayload, setRevisionLoadPayload] =
    useState<RevisionLoadPayload | null>(null);

  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContentRef = useRef<string>("");
  const pendingSnapshotRef = useRef(false);
  const editsSinceSnapshotRef = useRef(0);
  const lastSnapshotAtRef = useRef(0);
  const snapshotInFlightRef = useRef(false);

  const shareUrl = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : `${window.location.origin}/doc/${documentId}`,
    [documentId]
  );

  const updateMetadata = useCallback(
    async (payload: { title?: string; touch?: boolean }) => {
      setSaveState("saving");
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error("Failed to update document metadata");
        }
        const data = (await response.json()) as {
          document: DocumentSummary;
        };
        setUpdatedAt(data.document.updatedAt);
        setSaveState("saved");
      } catch (error) {
        console.error(error);
        setSaveState("error");
      }
    },
    [documentId]
  );

  const fetchRevisions = useCallback(async () => {
    setIsRevisionsLoading(true);
    try {
      const response = await fetch(
        `/api/revisions?documentId=${encodeURIComponent(documentId)}&limit=60`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch revisions");
      }
      const data = (await response.json()) as { revisions: RevisionSummary[] };
      setRevisions(data.revisions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRevisionsLoading(false);
    }
  }, [documentId]);

  const saveSnapshot = useCallback(
    async () => {
      if (snapshotInFlightRef.current) {
        return;
      }

      const content = latestContentRef.current;
      if (!content) {
        return;
      }

      const shouldSave =
        pendingSnapshotRef.current || editsSinceSnapshotRef.current >= 20;
      if (!shouldSave) {
        return;
      }

      snapshotInFlightRef.current = true;
      try {
        const response = await fetch("/api/revisions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            documentId,
            content
          })
        });
        if (!response.ok) {
          throw new Error("Failed to save snapshot");
        }
        const data = (await response.json()) as { created: boolean };
        pendingSnapshotRef.current = false;
        editsSinceSnapshotRef.current = 0;
        lastSnapshotAtRef.current = Date.now();
        if (data.created) {
          await fetchRevisions();
        }
      } catch (error) {
        console.error(error);
      } finally {
        snapshotInFlightRef.current = false;
      }
    },
    [documentId, fetchRevisions]
  );

  useEffect(() => {
    void fetchRevisions();
  }, [fetchRevisions]);

  useEffect(() => {
    const interval = setInterval(() => {
      void saveSnapshot();
    }, 45000);
    return () => clearInterval(interval);
  }, [saveSnapshot]);

  const queueTitleSave = useCallback(
    (nextTitle: string) => {
      if (!nextTitle.trim()) {
        return;
      }
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
      setSaveState("saving");
      titleDebounceRef.current = setTimeout(() => {
        void updateMetadata({ title: nextTitle.trim() });
      }, 700);
    },
    [updateMetadata]
  );

  const queueTouchUpdate = useCallback(() => {
    if (contentDebounceRef.current) {
      clearTimeout(contentDebounceRef.current);
    }
    contentDebounceRef.current = setTimeout(() => {
      void updateMetadata({ touch: true });
    }, 1200);
  }, [updateMetadata]);

  const handleSelectRevision = useCallback((revision: RevisionSummary) => {
    setSelectedRevisionId(revision.id);
    setRevisionLoadPayload({
      content: revision.content
    });
    toast.success("Revision loaded");
  }, []);

  const handleRestoreRevision = useCallback(async () => {
    if (!selectedRevisionId) {
      return;
    }
    setIsRestoringRevision(true);
    try {
      const response = await fetch("/api/revisions/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentId,
          revisionId: selectedRevisionId
        })
      });
      if (!response.ok) {
        throw new Error("Failed to restore revision");
      }
      const data = (await response.json()) as {
        restoredAs: RevisionSummary;
      };

      setSelectedRevisionId(data.restoredAs.id);
      setRevisionLoadPayload({
        content: data.restoredAs.content
      });
      latestContentRef.current = data.restoredAs.content;
      pendingSnapshotRef.current = false;
      editsSinceSnapshotRef.current = 0;
      setUpdatedAt(new Date().toISOString());
      setSaveState("saved");
      await fetchRevisions();
      toast.success("Revision restored");
    } catch (error) {
      console.error(error);
      toast.error("Could not restore revision");
    } finally {
      setIsRestoringRevision(false);
    }
  }, [documentId, fetchRevisions, selectedRevisionId]);

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy share link");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="surface overflow-hidden">
          <div className="border-b border-slate-200/90 bg-white/90 px-4 py-3 sm:px-6">
            <div className="grid items-center gap-3 lg:grid-cols-[1fr_minmax(360px,2fr)_1fr]">
              <div className="flex items-center justify-start gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-600 to-sky-500 text-white">
                    <FilePenLine className="h-3.5 w-3.5" />
                  </span>
                  SyncDraft
                </Link>
              </div>

              <div className="min-w-0">
                <input
                  value={title}
                  maxLength={140}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setTitle(nextValue);
                    queueTitleSave(nextValue);
                  }}
                  onBlur={() => {
                    if (!title.trim()) {
                      setTitle("Untitled Document");
                      queueTitleSave("Untitled Document");
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-center text-base font-semibold text-slate-900 outline-none ring-brand-300 transition placeholder:text-slate-400 focus:border-brand-300 focus:ring"
                />
              </div>

              <div className="flex justify-start lg:justify-end">
                <PresenceAvatars />
              </div>
            </div>
          </div>

          <LiveblocksPlugin>
            <div className="border-b border-slate-200/90 bg-white/85 px-4 py-2.5 sm:px-6">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                <Toolbar />
                <div className="flex items-center justify-between gap-2 lg:justify-end">
                  <SaveStatus state={saveState} updatedAt={updatedAt} />
                  <button
                    onClick={copyShareLink}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Copy link
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/60 p-4 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="lexical-editor relative min-h-[62vh] rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-lg shadow-slate-200/50 sm:px-8 sm:py-7">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="min-h-[56vh] whitespace-pre-wrap break-words pr-1 text-[15px] leading-7 text-slate-800 outline-none"
                        aria-placeholder="Start collaborating in real time..."
                        placeholder={<span />}
                      />
                    }
                    placeholder={
                      <div className="editor-placeholder px-1 py-0.5 text-sm">
                        Start collaborating in real time...
                      </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <OnChangePlugin
                    ignoreSelectionChange
                    onChange={(editorState) => {
                      queueTouchUpdate();

                      latestContentRef.current = JSON.stringify(
                        editorState.toJSON()
                      );
                      pendingSnapshotRef.current = true;
                      editsSinceSnapshotRef.current += 1;

                      const now = Date.now();
                      if (
                        editsSinceSnapshotRef.current >= 20 &&
                        now - lastSnapshotAtRef.current > 15000
                      ) {
                        void saveSnapshot();
                      }
                    }}
                  />
                  <RevisionLoader payload={revisionLoadPayload} />
                </div>

                <div className="lg:hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobileHistoryOpen((prev) => !prev)}
                    className="mb-3 inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History ({revisions.length})
                    </span>
                    {isMobileHistoryOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {isMobileHistoryOpen ? (
                    <RevisionHistoryPanel
                      revisions={revisions}
                      selectedRevisionId={selectedRevisionId}
                      onSelectRevision={handleSelectRevision}
                      onRestoreRevision={handleRestoreRevision}
                      onRefresh={() => void fetchRevisions()}
                      isLoading={isRevisionsLoading}
                      isRestoring={isRestoringRevision}
                    />
                  ) : null}
                </div>

                <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
                  <RevisionHistoryPanel
                    revisions={revisions}
                    selectedRevisionId={selectedRevisionId}
                    onSelectRevision={handleSelectRevision}
                    onRestoreRevision={handleRestoreRevision}
                    onRefresh={() => void fetchRevisions()}
                    isLoading={isRevisionsLoading}
                    isRestoring={isRestoringRevision}
                  />
                </div>
              </div>
            </div>

            <FloatingToolbar />
          </LiveblocksPlugin>
        </div>
      </LexicalComposer>
    </div>
  );
}

function EditorLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="surface overflow-hidden p-6">
        <div className="mb-3 h-12 rounded-xl bg-slate-200" />
        <div className="mb-3 h-12 rounded-xl bg-slate-200" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="h-[64vh] rounded-2xl bg-slate-100" />
          <div className="h-[64vh] rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function Editor({ document }: EditorProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={`syncdraft:${document.documentId}`}>
        <ClientSideSuspense fallback={<EditorLoading />}>
          <EditorCanvas
            documentId={document.documentId}
            initialTitle={document.title}
            initialUpdatedAt={document.updatedAt}
          />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
