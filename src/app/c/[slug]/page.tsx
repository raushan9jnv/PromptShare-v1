import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByCategory } from "@/lib/prompts";
import { categoryHighlights, getCategory } from "@/lib/taxonomy";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return notFound();

  const items = await listPromptsByCategory(slug);
  const highlight = categoryHighlights[slug];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">{category.name}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${highlight?.accentClassName ?? "from-orange-500/20 via-pink-400/10 to-transparent"}`} />
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Browse lane</div>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">{category.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">{category.description}</p>
            {highlight?.sampleOutputs?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {highlight.sampleOutputs.map((sample) => (
                  <span key={sample} className="rounded-full bg-surface-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-muted">{sample}</span>
                ))}
              </div>
            ) : null}
          </div>
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
