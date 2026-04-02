"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";

export default function PresenceAvatars() {
  const others = useOthers();
  const self = useSelf();

  const participants = [
    ...(self
      ? [
          {
            id: self.id,
            name: self.info?.name ?? "You",
            color: self.info?.color ?? "#3b82f6",
            isYou: true
          }
        ]
      : []),
    ...others.map((other) => ({
      id: other.id,
      name: other.info?.name ?? "Guest",
      color: other.info?.color ?? "#94a3b8",
      isYou: false
    }))
  ];

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Active
      </span>
      <div className="flex items-center">
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className="-ml-2 first:ml-0"
            style={{ zIndex: participants.length - index }}
            title={`${participant.name}${participant.isYou ? " (You)" : ""}`}
          >
            <div
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-white px-2 text-[10px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
              style={{ backgroundColor: participant.color }}
            >
              {participant.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      <span className="hidden text-xs font-medium text-slate-500 sm:inline">
        {participants.length} online
      </span>
    </div>
  );
}
