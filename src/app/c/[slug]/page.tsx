import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByCategory } from "@/lib/prompts";
import { categories, getCategory } from "@/lib/taxonomy";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = await listPromptsByCategory(slug).catch(() => []);

  return (
    <div className="pb-16">
      <div className="border-b border-border-default px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-content-muted">
            <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
            <span>/</span>
            <span className="text-content-secondary">{category.name}</span>
          </nav>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.slice(0, 1)}
                </span>
                <h1 className="text-xl font-medium text-content-primary">{category.name}</h1>
              </div>
              <p className="text-sm text-content-muted">{category.description}</p>
            </div>
            <span className="shrink-0 rounded-full border border-border-default bg-surface-secondary px-3 py-1 text-xs text-content-muted">
              {items.length > 0 ? items.length : category.count} prompts
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {items.length > 0 ? (
          <div className="grid gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-4">
            {items.map((prompt) => (
              <div key={prompt.id} className="bg-surface-primary">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border-default bg-surface-card py-16 text-center text-sm text-content-muted">
            No prompts in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
