import { notFound } from "next/navigation";
import Editor from "@/components/Editor";
import { ensureDocument } from "@/lib/documents";

export const dynamic = "force-dynamic";

type DocumentPageProps = {
  params: {
    id: string;
  };
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  if (!params.id?.trim()) {
    notFound();
  }

  let document: Awaited<ReturnType<typeof ensureDocument>>;
  try {
    document = await ensureDocument(params.id.trim());
  } catch (error) {
    console.error("Failed to load document page", error);
    return (
      <main className="min-h-screen pb-10 pt-6 sm:pt-8">
        <div className="shell-container">
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
            <h1 className="text-xl font-semibold text-slate-900">
              Unable to open this document
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-10 pt-6 sm:pt-8">
      <div className="shell-container">
        <Editor document={document} />
      </div>
    </main>
  );
}
