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
    <div className="px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Search</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {query ? (
            <>
              Results for <span className="font-medium text-zinc-900">&quot;{query}&quot;</span>
            </>
          ) : (
            "Enter a query in the header to search prompts."
          )}
        </p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
            <div className="mt-2 text-xs text-red-700">
              If you have not run the Supabase SQL yet, open{" "}
              <code className="rounded bg-red-100 px-1">supabase/migrations/001_prompts_and_assets.sql</code>{" "}
              and run it in the Supabase SQL Editor.
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {items.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
          {!error && items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              No prompts found.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
