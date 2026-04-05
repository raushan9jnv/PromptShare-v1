import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByCategory } from "@/lib/prompts";
import { categories, getCategory } from "@/lib/taxonomy";

export function generateStaticParams() {
  return categories.filter((category) => category.slug !== "trending").map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = await listPromptsByCategory(slug).catch(() => []);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted"><Link href="/">Home</Link><span>/</span><span className="text-content-secondary">{category.name}</span></nav>
        <section className="rounded-[30px] border border-border-default/80 bg-surface-card p-6 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Category</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-content-primary">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-content-secondary">{category.description}</p>
        </section>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}</div>
        {items.length === 0 ? <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-8 text-center text-sm text-content-secondary">No prompts in this category yet.</div> : null}
      </div>
    </div>
  );
}
