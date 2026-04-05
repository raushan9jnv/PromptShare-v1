import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { searchPrompts } from "@/lib/prompts";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const items = await searchPrompts(query);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">Search</span>
        </nav>

        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Search vault</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">{query ? `Results for “${query}”` : "Search prompt packs, transforms, and workflows"}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">
            {query ? "Results include seeded creator examples plus anything already available from your live prompt library." : "Use search to jump straight into a prompt lane instead of browsing the full library."}
          </p>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} variant="standard" />
          ))}
        </div>
      </div>
    </div>
  );
}
