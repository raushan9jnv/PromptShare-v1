/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsTrending } from "@/lib/prompts";
import { categories, categoryHighlights, models } from "@/lib/taxonomy";

const MODEL_LOGO_FILES: Record<string, string> = {
  gemini: "/logos/gemini.svg",
  chatgpt: "/logos/chatgpt.svg",
  claude: "/logos/claude.svg",
  copilot: "/logos/copilot.svg",
  midjourney: "/logos/midjourney.svg",
  dalle: "/logos/dalle.svg",
  "stable-diffusion": "/logos/stable-diffusion.svg",
};

const homeCategorySlugs = ["youtube", "social-media", "marketing", "image-prompts", "design", "productivity"];

const collectionConfig = [
  {
    title: "Trending this week",
    description: "Fresh community prompts picking up momentum.",
    href: "/c/trending",
    pick: (items: Awaited<ReturnType<typeof listPromptsTrending>>) => items.slice(0, 3),
  },
  {
    title: "Best for creators",
    description: "Short-form, scripts, thumbnails, and visual prompt ideas.",
    href: "/c/social-media",
    pick: (items: Awaited<ReturnType<typeof listPromptsTrending>>) =>
      items.filter((item) => item.categorySlugs.some((slug) => ["youtube", "social-media", "design", "marketing"].includes(slug))).slice(0, 3),
  },
  {
    title: "Image prompt packs",
    description: "Visual-first prompts with previews and scene direction.",
    href: "/t/image",
    pick: (items: Awaited<ReturnType<typeof listPromptsTrending>>) => items.filter((item) => item.contentType === "image").slice(0, 3),
  },
  {
    title: "Start here",
    description: "Easy wins for new visitors who just want something useful fast.",
    href: "/search?q=template",
    pick: (items: Awaited<ReturnType<typeof listPromptsTrending>>) => items.slice(2, 5),
  },
] as const;

function CategoryIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "youtube":
      return <span className="text-2xl">?</span>;
    case "social-media":
      return <span className="text-2xl">#</span>;
    case "marketing":
      return <span className="text-2xl">?</span>;
    case "image-prompts":
      return <span className="text-2xl">?</span>;
    case "design":
      return <span className="text-2xl">?</span>;
    case "productivity":
      return <span className="text-2xl">?</span>;
    default:
      return <span className="text-2xl">•</span>;
  }
}

export default async function Home() {
  let trending: Awaited<ReturnType<typeof listPromptsTrending>> = [];
  let dbError: string | null = null;

  try {
    trending = await listPromptsTrending(9);
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Could not load prompts.";
  }

  const featured = trending[0] ?? null;
  const supporting = featured ? trending.slice(1, 5) : trending.slice(0, 4);
  const collectionCards = collectionConfig.map((collection) => ({
    ...collection,
    prompts: collection.pick(trending),
  }));
  const highlightedCategories = homeCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean);

  return (
    <div className="relative overflow-hidden pb-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[820px] bg-[radial-gradient(circle_at_top_left,rgba(255,180,120,0.34),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,104,56,0.2),transparent_30%),linear-gradient(180deg,#fff8f1_0%,#fffaf6_40%,#f7f4ee_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,145,77,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(245,110,66,0.12),transparent_25%),linear-gradient(180deg,#181311_0%,#151311_45%,#131313_100%)]" />
      <div className="absolute inset-x-0 top-[180px] -z-10 h-56 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.58),transparent)] blur-3xl dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

      <section className="px-4 pb-14 pt-10 sm:px-6 lg:px-10 lg:pb-18 lg:pt-14">
        <div className="mx-auto grid w-full max-w-[1380px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-content-secondary shadow-[0_12px_30px_-22px_rgba(145,73,24,0.5)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              Creator-first prompt discovery
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.04em] text-content-primary sm:text-6xl lg:text-7xl">
              Find prompts that feel tested, visual, and ready to ship.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-content-secondary sm:text-lg">
              PromptShare is your creator vault for hooks, scripts, image prompts, and reusable workflows. Browse what is working, preview the output style, then copy and use it fast.
            </p>

            <form action="/search" method="get" className="mt-8 max-w-2xl">
              <div className="flex flex-col gap-3 rounded-[30px] border border-white/70 bg-white/75 p-3 shadow-[0_28px_90px_-48px_rgba(145,73,24,0.55)] backdrop-blur md:flex-row md:items-center dark:border-white/10 dark:bg-white/5">
                <div className="relative flex-1">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-content-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="search"
                    name="q"
                    placeholder="Search YouTube scripts, prompt packs, brand voice, image prompts..."
                    className="h-14 w-full rounded-full bg-surface-primary pl-12 pr-4 text-sm text-content-primary outline-none placeholder:text-content-muted"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm shadow-accent-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-700"
                  >
                    Explore prompts
                  </button>
                  <Link
                    href="/submit"
                    className="inline-flex h-14 items-center justify-center rounded-full border border-border-default bg-surface-card px-6 text-sm font-semibold text-content-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary"
                  >
                    Share your prompt
                  </Link>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-content-secondary">
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm dark:bg-white/5">Copy-ready</span>
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm dark:bg-white/5">Preview-backed</span>
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm dark:bg-white/5">Community shared</span>
            </div>
          </div>

          <div className="relative animate-fade-in-up-delay-1">
            <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_55%)]" />
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              {featured ? <PromptCard prompt={featured} variant="featured" /> : null}
              <div className="grid gap-4 self-end">
                {supporting.slice(0, 2).map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6 rounded-[30px] border border-white/60 bg-white/72 p-6 shadow-[0_20px_60px_-44px_rgba(145,73,24,0.45)] backdrop-blur dark:border-white/10 dark:bg-white/5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Built for modern creators</div>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-content-secondary">
              Browse curated prompts for {categories.length - 1} categories, move between {models.length} model ecosystems, and find prompts with visual proof instead of dead-end text blocks.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-content-secondary">
            {models.map((model) => {
              const logoSrc = MODEL_LOGO_FILES[model.slug];
              return (
                <Link key={model.slug} href={`/m/${model.slug}`} className="inline-flex items-center gap-2 hover:text-content-primary">
                  {logoSrc ? <img src={logoSrc} alt={model.name} width={18} height={18} className="h-[18px] w-[18px]" /> : null}
                  <span>{model.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {dbError ? (
        <div className="mx-auto mt-8 w-full max-w-[1380px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="font-medium text-amber-900 dark:text-amber-300">Database not ready</div>
            <p className="mt-1 text-amber-800 dark:text-amber-400/80">{dbError}</p>
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-400/60">Run the SQL migrations in Supabase to enable live prompt content.</p>
          </div>
        </div>
      ) : null}

      <section className="px-4 py-18 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Featured paths</div>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">Start in the right lane, not from scratch.</h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {collectionCards.map((collection) => (
              <Link
                key={collection.title}
                href={collection.href}
                className="group rounded-[28px] border border-border-default/80 bg-surface-card/90 p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-accent-300"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Collection</div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-content-primary">{collection.title}</h3>
                <p className="mt-2 text-sm leading-7 text-content-secondary">{collection.description}</p>
                <div className="mt-5 space-y-2">
                  {collection.prompts.length > 0 ? (
                    collection.prompts.map((prompt) => (
                      <div key={prompt.id} className="rounded-2xl bg-surface-secondary px-3 py-3 text-sm text-content-primary">
                        <div className="line-clamp-1 font-medium">{prompt.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-content-muted">{prompt.contentType}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-surface-secondary px-3 py-4 text-sm text-content-secondary">Fresh prompts will appear here once your database is connected.</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Browse by category</div>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">Choose a creator workflow.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-content-secondary">
                These are the fastest lanes into the library for creators who want something usable in minutes.
              </p>
            </div>
            <Link href="/c/trending" className="hidden text-sm font-medium text-content-secondary transition-colors hover:text-content-primary sm:inline-flex">
              View all categories
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlightedCategories.map((category) => {
              const highlight = categoryHighlights[category!.slug];
              return (
                <Link
                  key={category!.slug}
                  href={`/c/${category!.slug}`}
                  className="group relative overflow-hidden rounded-[28px] border border-border-default/80 bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-300 hover:shadow-[0_22px_70px_-50px_rgba(243,115,53,0.45)]"
                >
                  <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${highlight?.accentClassName ?? "from-orange-500/20 via-pink-400/10 to-transparent"}`} />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/75 text-content-primary shadow-sm dark:bg-white/10">
                      <CategoryIcon slug={category!.slug} />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-content-primary">{category!.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-content-secondary">{category!.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(highlight?.sampleOutputs ?? []).map((sample) => (
                        <span key={sample} className="rounded-full bg-surface-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                          {sample}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-18 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Latest drops</div>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">Trending prompts worth opening.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-content-secondary">
                Designed to feel more like featured content than a dead grid. Open one, preview the result style, and copy fast.
              </p>
            </div>
            <Link href="/c/trending" className="text-sm font-medium text-content-secondary transition-colors hover:text-content-primary">
              View all trending
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trending.slice(0, 8).map((prompt, index) => (
              <div key={prompt.id} className={index === 0 ? "md:col-span-2 xl:col-span-2" : ""}>
                <PromptCard prompt={prompt} variant={index === 0 ? "featured" : "standard"} />
              </div>
            ))}
          </div>

          {!dbError && trending.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-border-default bg-surface-card p-10 text-center">
              <p className="text-base text-content-secondary">
                No prompts yet. <Link href="/submit" className="font-semibold text-content-primary underline underline-offset-4">Share the first one</Link> and turn this into a real creator vault.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1380px] gap-4 rounded-[32px] border border-border-default/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,238,0.92))] p-6 shadow-[0_20px_70px_-48px_rgba(145,73,24,0.45)] dark:bg-[linear-gradient(135deg,rgba(28,24,22,0.96),rgba(22,22,22,0.94))] md:grid-cols-3">
          {[
            ["Find a prompt", "Browse categories, featured packs, or search a specific workflow."],
            ["Preview the vibe", "Open prompts with media previews so the output style is easy to trust."],
            ["Copy and use", "Take the prompt text into your model, then remix it for your project."],
          ].map(([title, body], index) => (
            <div key={title} className="rounded-[24px] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-600 text-sm font-semibold text-white">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-content-primary">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-content-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-18 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1380px] rounded-[36px] border border-border-default/80 bg-[linear-gradient(135deg,rgba(252,104,43,0.96),rgba(241,138,63,0.92))] p-8 text-white shadow-[0_30px_90px_-50px_rgba(196,78,23,0.75)] sm:p-12">
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">Creator submission</div>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] sm:text-5xl">Share a prompt that actually works.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/82">
              Add your best-performing prompts, show the preview outcome, and help the next creator skip the blank-page feeling.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#9e4319] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Submit your prompt
              </Link>
              <Link
                href="/c/trending"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Explore the library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

