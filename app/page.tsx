import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CreateDocCard from "@/components/CreateDocCard";
import RecentDocsList from "@/components/RecentDocsList";
import { listRecentDocuments } from "@/lib/documents";
import type { DocumentSummary } from "@/types/document";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let documents: DocumentSummary[] = [];
  try {
    documents = await listRecentDocuments(12);
  } catch (error) {
    console.error("Failed to load home documents", error);
  }

  return (
    <main className="min-h-screen pb-14">
      <Header />
      <div className="shell-container mt-8 space-y-7">
        <Hero />

        <section
          id="recent-documents"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
        >
          <div id="create-document">
            <CreateDocCard />
          </div>
          <RecentDocsList documents={documents} />
        </section>
      </div>
    </main>
  );
}
