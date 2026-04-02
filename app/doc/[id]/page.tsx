import { notFound } from "next/navigation";
import Header from "@/components/Header";
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

  const document = await ensureDocument(params.id.trim());

  return (
    <main className="min-h-screen pb-10">
      <Header showBackToHome />
      <div className="shell-container mt-6">
        <Editor document={document} />
      </div>
    </main>
  );
}
