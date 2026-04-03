import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { appConfig } from "@/lib/config";
import { listPromptsTrending } from "@/lib/prompts";
import { categories } from "@/lib/taxonomy";

export default async function Home() {
  let trending: Awaited<ReturnType<typeof listPromptsTrending>> = [];
  let dbError: string | null = null;

  try {
    trending = await listPromptsTrending(12);
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Could not load prompts.";
  }

  const popular = categories.filter((c) => !["trending"].includes(c.slug)).slice(0, 6);

  return (
    <div className="px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Discover prompts that work.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Browse by category and content type, copy a prompt, then open it in Gemini or your favorite
          tool. Upload your own images, video, or audio previews — nothing is generated on our servers.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/c/trending"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-900"
          >
            Browse trending
          </Link>
          <a
            href={appConfig.links.gemini}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
          >
            Open Gemini
          </a>
        </div>
      </section>

      {dbError ? (
        <div className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <div className="font-medium">Database not ready</div>
          <p className="mt-1 text-amber-900/90">{dbError}</p>
          <p className="mt-2 text-xs text-amber-900/80">
            In Supabase → SQL Editor, run{" "}
            <code className="rounded bg-amber-100 px-1">001_prompts_and_assets.sql</code> then{" "}
            <code className="rounded bg-amber-100 px-1">002_storage_prompt_images.sql</code>.
          </p>
        </div>
      ) : null}

      <section className="mx-auto mt-10 w-full max-w-3xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-950">Trending</div>
            <div className="mt-1 text-sm text-zinc-600">Recently shared prompts.</div>
          </div>
          <Link href="/c/trending" className="text-sm font-medium text-zinc-950 underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {trending.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
          {!dbError && trending.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              No prompts yet. Be the first to{" "}
              <Link href="/submit" className="font-medium text-zinc-950 underline underline-offset-4">
                submit
              </Link>
              .
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-3xl">
        <div className="text-sm font-semibold text-zinc-950">Popular categories</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {popular.map((c) => (
            <Link
              key={c.slug}
              href={`/c/${c.slug}`}
              className="rounded-2xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-950">{c.name}</div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
