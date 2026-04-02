import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CreateDocCard from "@/components/CreateDocCard";
import RecentDocsList from "@/components/RecentDocsList";
import { listRecentDocuments } from "@/lib/documents";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const documents = await listRecentDocuments(12);

  return (
    <main className="min-h-screen pb-14">
      <Header />
      <div className="shell-container mt-8 space-y-7">
        <Hero />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <CreateDocCard />
          <RecentDocsList documents={documents} />
        </section>
      </div>
    </main>
  );
}
