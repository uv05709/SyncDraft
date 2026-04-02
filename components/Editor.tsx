"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
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
import type { DocumentSummary, SaveState } from "@/types/document";
import PresenceAvatars from "@/components/PresenceAvatars";
import SaveStatus from "@/components/SaveStatus";
import Toolbar from "@/components/Toolbar";

type EditorProps = {
  document: DocumentSummary;
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

  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div className="surface w-full p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Document title
          </label>
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-semibold text-slate-900 outline-none ring-brand-300 transition placeholder:text-slate-400 focus:border-brand-300 focus:ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SaveStatus state={saveState} updatedAt={updatedAt} />
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <Link2 className="h-3.5 w-3.5" />
            Copy share link
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <LexicalComposer initialConfig={initialConfig}>
        <LiveblocksPlugin>
          <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
            <Toolbar />
            <PresenceAvatars />
          </div>

          <div className="lexical-editor relative min-h-[58vh] rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-inner shadow-slate-100 sm:px-5 sm:py-5">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[54vh] whitespace-pre-wrap break-words pr-1 text-[15px] leading-7 text-slate-800 outline-none"
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
              onChange={() => {
                queueTouchUpdate();
              }}
            />
          </div>

          <FloatingToolbar />
        </LiveblocksPlugin>
      </LexicalComposer>
    </div>
  );
}

function EditorLoading() {
  return (
    <div className="surface w-full animate-pulse p-6">
      <div className="mb-4 h-10 rounded-xl bg-slate-200" />
      <div className="mb-4 h-11 rounded-xl bg-slate-200" />
      <div className="h-[60vh] rounded-xl bg-slate-100" />
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
