import Header from "@/components/Header";

export default function LoadingDocumentPage() {
  return (
    <main className="min-h-screen pb-10">
      <Header showBackToHome />
      <div className="shell-container mt-6">
        <div className="surface animate-pulse p-6">
          <div className="mb-4 h-10 rounded-xl bg-slate-200" />
          <div className="mb-4 h-11 rounded-xl bg-slate-200" />
          <div className="h-[60vh] rounded-xl bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
