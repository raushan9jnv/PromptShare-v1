import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByContentType } from "@/lib/prompts";
import { getContentType } from "@/lib/taxonomy";

export default async function ContentTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = getContentType(slug);
  if (!info) return notFound();

  let items: Awaited<ReturnType<typeof listPromptsByContentType>> = [];
  let error: string | null = null;

  try {
    items = await listPromptsByContentType(info.slug);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load prompts.";
  }

  return (
    <div className="px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{info.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">{info.description}</p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {items.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
          {!error && items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              No prompts yet for this type. Submit one from the header.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
