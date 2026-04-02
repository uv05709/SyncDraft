"use client";

import { useContext, useEffect, useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { mergeRegister } from "@lexical/utils";
import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { SELECTION_CHANGE_COMMAND } from "lexical";
import { cn } from "@/lib/utils";

function ToolbarButton({
  label,
  active,
  onClick,
  children
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-slate-600 transition",
        "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
        active
          ? "border-brand-300 bg-brand-50 text-brand-700"
          : "border-transparent bg-transparent"
      )}
    >
      {children}
    </button>
  );
}

export default function Toolbar() {
  const composerContext = useContext(LexicalComposerContext);
  const editor = composerContext?.[0];
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    if (!editor) {
      return;
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
          }
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
          }
          return false;
        },
        1
      )
    );
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex min-h-11 flex-1 flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
      <ToolbarButton
        label="Bold"
        active={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <span className="ml-auto hidden rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 sm:inline">
        Ctrl/Cmd + B, I, U
      </span>
    </div>
  );
}
