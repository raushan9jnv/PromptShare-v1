import Link from "next/link";

import { CategoryIcon } from "@/components/CategoryIcon";
import { PromptCard } from "@/components/PromptCard";

export const revalidate = 60;
import { listPromptsTrending } from "@/lib/prompts";
import { categories } from "@/lib/taxonomy";

const featuredSlugs = ["image-transform", "social-media", "youtube", "marketing", "design", "software"];

export default async function Home() {
  let prompts = [] as Awaited<ReturnType<typeof listPromptsTrending>>;
  let dbError: string | null = null;

  try {
    prompts = await listPromptsTrending(9);
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Could not load prompts.";
  }

  const featured = prompts[0] ?? null;
  const rest = featured ? prompts.slice(1) : prompts;
  const featuredCats = featuredSlugs
    .map((s) => categories.find((c) => c.slug === s))
    .filter(Boolean);

  return (
    <div className="pb-16">
      <section className="border-b border-border-default px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-card px-3 py-1 text-xs text-content-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-600 dark:bg-accent-400" aria-hidden="true" />
            Creator-first prompt library
          </div>
          <h1 className="mb-4 text-4xl font-medium leading-[1.1] tracking-[-0.04em] text-content-primary sm:text-5xl">
            Find prompts that<br />
            <em className="not-italic text-accent-600 dark:text-accent-400">actually work.</em>
          </h1>
          <p className="mb-8 text-base text-content-secondary">
            Curated by creators, tested in the wild. Image transforms, social hooks, prompt packs and more.
          </p>
          <form action="/search" method="get" className="mx-auto flex max-w-md overflow-hidden rounded-xl border border-border-default bg-surface-card focus-within:border-[var(--accent-strong)]">
            <label htmlFor="hero-search" className="sr-only">Search prompts</label>
            <div className="relative flex-1">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input id="hero-search" name="q" type="search" placeholder="Search prompts, styles, tools…"
                className="h-11 w-full bg-transparent pl-9 pr-3 text-sm text-content-primary outline-none placeholder:text-content-muted"
              />
            </div>
            <button type="submit" className="h-11 shrink-0 bg-accent-600 px-5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Search
            </button>
          </form>
        </div>
      </section>

      {dbError ? (
        <div className="mx-auto mt-6 max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <span className="font-medium">Database not ready — </span>{dbError}
          </div>
        </div>
      ) : null}

      {prompts.length > 0 ? (
        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-content-primary">Trending now</h2>
              <span className="rounded-full border border-border-default bg-surface-secondary px-2 py-0.5 text-xs text-content-muted">{prompts.length} prompts</span>
            </div>
            <Link href="/c/trending" className="text-xs text-content-muted transition-colors hover:text-content-primary">
              See all →
            </Link>
          </div>

          <div className="grid gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-3">
            {featured ? (
              <div className="col-span-full bg-surface-primary lg:col-span-2">
                <PromptCard prompt={featured} variant="featured" priority />
              </div>
            ) : null}
            {rest.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-surface-primary">
                <PromptCard prompt={p} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-content-primary">Browse by category</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featuredCats.map((cat) => (
            <Link
              key={cat!.slug}
              href={`/c/${cat!.slug}`}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border-default bg-surface-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-strong)] hover:shadow-lg"
            >
              <div
                className="absolute inset-0 opacity-[0.07] transition-opacity group-hover:opacity-[0.12]"
                style={{ background: `radial-gradient(circle at 30% 20%, ${cat!.color}, transparent 70%)` }}
                aria-hidden="true"
              />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${cat!.color}18` }}>
                <CategoryIcon slug={cat!.slug} className="h-5 w-5" color={cat!.color} />
              </div>
              <div className="relative">
                <div className="text-[13px] font-semibold text-content-primary transition-colors group-hover:text-[var(--accent-strong)]">{cat!.name}</div>
                <div className="mt-0.5 text-[11px] text-content-muted">{cat!.count} prompts</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
