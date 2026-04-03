import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByCategory, listPromptsTrending } from "@/lib/prompts";
import { getCategory } from "@/lib/taxonomy";

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

  return (
    <div className="px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{category.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">{category.description}</p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
            <div className="mt-2 text-xs text-red-700">
              Run{" "}
              <code className="rounded bg-red-100 px-1">supabase/migrations/001_prompts_and_assets.sql</code>{" "}
              in Supabase SQL Editor if tables are missing.
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {items.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
          {!error && items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              No prompts yet in this category. Submit the first one.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
