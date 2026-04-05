import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { searchPrompts } from "@/lib/prompts";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let items: Awaited<ReturnType<typeof searchPrompts>> = [];
  let error: string | null = null;

  try {
    items = await searchPrompts(query);
  } catch (e) {
    error = e instanceof Error ? e.message : "Search failed.";
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">Search</span>
        </nav>

        <section className="rounded-[32px] border border-border-default/80 bg-surface-card/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Search</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">
            {query ? `Results for “${query}”` : "Search the vault"}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">
            {query
              ? "Browse the most relevant prompts, open the ones that look right, and copy the best fit into your model."
              : "Use the homepage or header search to find prompt packs, scripts, and reusable creative workflows."}
          </p>
        </section>

        {error ? (
          <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm dark:border-red-500/20 dark:bg-red-500/10">
            <div className="font-medium text-red-800 dark:text-red-300">{error}</div>
            <div className="mt-2 text-xs text-red-700 dark:text-red-400/70">If needed, run the Supabase SQL migration first.</div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} variant="standard" />
          ))}
        </div>

        {!error && items.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-10 text-center text-sm text-content-secondary">
            No prompts found yet. Try a broader search term or browse a category first.
          </div>
        ) : null}
      </div>
    </div>
  );
}

