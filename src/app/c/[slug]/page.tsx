import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByCategory, listPromptsTrending } from "@/lib/prompts";
import { categoryHighlights, getCategory } from "@/lib/taxonomy";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return notFound();

  let items: Awaited<ReturnType<typeof listPromptsByCategory>> = [];
  let error: string | null = null;

  try {
    items = slug === "trending" ? await listPromptsTrending(50) : await listPromptsByCategory(slug);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load prompts.";
  }

  const highlight = categoryHighlights[slug];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">{category.name}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[32px] border border-border-default/80 bg-surface-card/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${highlight?.accentClassName ?? "from-orange-500/20 via-pink-400/10 to-transparent"}`} />
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Category</div>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">{category.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">{category.description}</p>
            {highlight?.sampleOutputs?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {highlight.sampleOutputs.map((sample) => (
                  <span key={sample} className="rounded-full bg-surface-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                    {sample}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm dark:border-red-500/20 dark:bg-red-500/10">
            <div className="font-medium text-red-800 dark:text-red-300">{error}</div>
            <div className="mt-2 text-xs text-red-700 dark:text-red-400/70">Run the Supabase SQL migrations if tables are missing.</div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} variant="standard" />
          ))}
        </div>

        {!error && items.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-10 text-center text-sm text-content-secondary">
            No prompts yet in this lane. <Link href="/submit" className="font-semibold text-content-primary underline underline-offset-4">Share one</Link> and make it feel alive.
          </div>
        ) : null}
      </div>
    </div>
  );
}

