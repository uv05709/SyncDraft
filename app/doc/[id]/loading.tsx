export default function LoadingDocumentPage() {
  return (
    <main className="min-h-screen pb-10 pt-6 sm:pt-8">
      <div className="shell-container">
        <div className="mx-auto w-full max-w-5xl">
          <div className="surface animate-pulse p-6">
            <div className="mb-3 h-12 rounded-xl bg-slate-200" />
            <div className="mb-3 h-12 rounded-xl bg-slate-200" />
            <div className="h-[64vh] rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    </main>
  );
}
