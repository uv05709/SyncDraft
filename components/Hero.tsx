import { Sparkles, Users, Zap } from "lucide-react";

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
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/90 to-blue-100/80 p-8 shadow-soft sm:p-10 lg:p-14">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="relative">
        <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800">
          Hackathon-ready collaborative editor
        </p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Write together in real time with{" "}
          <span className="bg-gradient-to-r from-brand-700 to-sky-600 bg-clip-text text-transparent">
            SyncDraft
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
          Create a shared document, invite teammates instantly, and collaborate
          with live cursors, presence, and rich text formatting.
        </p>
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm"
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
