/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsTrending } from "@/lib/prompts";
import { categories } from "@/lib/taxonomy";

const homeCategories = ["image-transform", "social-media", "prompt-packs", "youtube", "marketing", "software"];

export default async function Home() {
  let prompts = [] as Awaited<ReturnType<typeof listPromptsTrending>>;
  let dbError: string | null = null;

  try {
    prompts = await listPromptsTrending(8);
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Could not load prompts.";
  }

  const featured = prompts[0] ?? null;
  const gridItems = featured ? prompts.slice(1, 5) : prompts.slice(0, 4);
  const homeTiles = homeCategories.map((slug) => categories.find((category) => category.slug === slug)).filter(Boolean);

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_top_left,rgba(232,136,58,0.22),transparent_40%),radial-gradient(circle_at_top_right,rgba(30,157,139,0.16),transparent_32%),linear-gradient(180deg,#fff8f1_0%,#fffaf6_48%,#f7f4ee_100%)] dark:bg-[linear-gradient(180deg,#171311_0%,#131313_100%)]" />

      <section className="px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-content-secondary shadow-sm dark:border-white/10 dark:bg-white/5">
              Creator-first prompt library
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[0.96] tracking-[-0.04em] text-content-primary sm:text-6xl lg:text-7xl">
              Prompts that look usable before you even open them.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-content-secondary sm:text-lg">
              Built for image transformations, social growth, and practical creator workflows. Search fast, open the good ones, and reuse the parts that fit your style.
            </p>

            <form action="/search" method="get" className="mt-8 max-w-2xl">
              <div className="flex flex-col gap-3 rounded-[30px] border border-white/80 bg-white/80 p-3 shadow-[0_28px_90px_-48px_rgba(145,73,24,0.45)] backdrop-blur md:flex-row md:items-center dark:border-white/10 dark:bg-white/5">
                <div className="relative flex-1">
                  <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input type="search" name="q" placeholder="Search image transforms, reel hooks, prompt packs..." className="h-14 w-full rounded-full bg-surface-primary pl-12 pr-4 text-sm text-content-primary outline-none placeholder:text-content-muted" />
                </div>
                <button type="submit" className="inline-flex h-14 items-center justify-center rounded-full bg-accent-600 px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-700">
                  Explore prompts
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featured ? <div className="md:col-span-2"><PromptCard prompt={featured} variant="featured" /></div> : null}
            {gridItems.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} variant="compact" />)}
          </div>
        </div>
      </section>

      {dbError ? (
        <div className="mx-auto mb-8 max-w-[1380px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <div className="font-medium">Database not ready</div>
            <p className="mt-1">{dbError}</p>
          </div>
        </div>
      ) : null}

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Fresh picks</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-content-primary sm:text-4xl">Open the strongest cards first.</h2>
            </div>
            <Link href="/c/trending" className="text-sm font-medium text-content-secondary transition-colors hover:text-content-primary">View all</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {prompts.slice(0, 4).map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Categories</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-content-primary sm:text-4xl">Pick a lane and move fast.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homeTiles.map((category) => (
              <Link key={category!.slug} href={`/c/${category!.slug}`} className="rounded-[28px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-1 hover:border-[var(--accent-strong)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: category!.color }}>{category!.name.slice(0, 1)}</span>
                    <div>
                      <div className="text-lg font-semibold text-content-primary">{category!.name}</div>
                      <div className="text-sm text-content-muted">{category!.count} prompts</div>
                    </div>
                  </div>
                  <span className="text-content-muted">→</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-content-secondary">{category!.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}