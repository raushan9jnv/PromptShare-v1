import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { searchPrompts } from "@/lib/prompts";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let items: Awaited<ReturnType<typeof searchPrompts>> = [];
  let error: string | null = null;

  try {
    items = await searchPrompts(query);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Search failed.";
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <section className="rounded-[30px] border border-border-default/80 bg-surface-card p-6 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Search</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-content-primary">{query ? `Results for "${query}"` : "Search the library"}</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-content-secondary">Find prompt cards by keyword, then open the strongest match.</p>
        </section>

        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}
        </div>

        {!error && items.length === 0 ? <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-8 text-center text-sm text-content-secondary">No prompts found. Try a broader search or browse a category.</div> : null}
      </div>
    </div>
  );
}
