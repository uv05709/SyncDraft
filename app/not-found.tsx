import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="surface max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Document not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          The requested document could not be located.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
