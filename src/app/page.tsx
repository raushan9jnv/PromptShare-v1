/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";

import { PromptCard } from "@/components/PromptCard";
import { listPromptCollections, listPromptsTrending } from "@/lib/prompts";
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

const heroCategories = ["image-transform", "image-prompts", "social-media", "youtube", "marketing", "design"];

function CategoryGlyph({ slug }: { slug: string }) {
  const glyphs: Record<string, string> = {
    "image-transform": "↺",
    "image-prompts": "✦",
    "social-media": "#",
    youtube: "▶",
    marketing: "↗",
    design: "◇",
  };

  return <span className="text-2xl">{glyphs[slug] ?? "•"}</span>;
}

export default async function Home() {
  const [trending, collections] = await Promise.all([listPromptsTrending(10), listPromptCollections()]);
  const featured = trending[0] ?? null;
  const heroSupport = trending.slice(1, 4);
  const categoryCards = heroCategories.map((slug) => categories.find((category) => category.slug === slug)).filter(Boolean);
  const softwareLane = trending.filter((prompt) => prompt.categorySlugs.includes("software") || prompt.categorySlugs.includes("education")).slice(0, 2);

  return (
    <div className="relative overflow-hidden pb-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[920px] bg-[radial-gradient(circle_at_top_left,rgba(255,180,120,0.38),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,103,54,0.22),transparent_28%),linear-gradient(180deg,#fff8f1_0%,#fffaf6_45%,#f7f4ee_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,145,77,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(245,110,66,0.12),transparent_26%),linear-gradient(180deg,#181311_0%,#151311_45%,#131313_100%)]" />
      <div className="absolute left-1/2 top-[140px] -z-10 h-64 w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.6),transparent_60%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_60%)]" />

      <section className="px-4 pb-14 pt-10 sm:px-6 lg:px-10 lg:pb-18 lg:pt-14">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-content-secondary shadow-[0_12px_30px_-22px_rgba(145,73,24,0.5)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              Creator vault for transformations, hooks, and prompt packs
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.93] tracking-[-0.05em] text-content-primary sm:text-6xl xl:text-7xl">
              Make the output feel premium before you even hit copy.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-content-secondary sm:text-lg">
              PromptShare is built for creators who want before-and-after style prompts, social media wins, cinematic image remixes, and reusable systems that actually improve the result.
            </p>

            <form action="/search" method="get" className="mt-8 max-w-2xl">
              <div className="flex flex-col gap-3 rounded-[32px] border border-white/70 bg-white/75 p-3 shadow-[0_28px_90px_-48px_rgba(145,73,24,0.55)] backdrop-blur md:flex-row md:items-center dark:border-white/10 dark:bg-white/5">
                <div className="relative flex-1">
                  <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="search"
                    name="q"
                    placeholder="Search old-photo restore, god mode portrait, reel hooks, thumbnail prompts..."
                    className="h-14 w-full rounded-full bg-surface-primary pl-12 pr-4 text-sm text-content-primary outline-none placeholder:text-content-muted"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="inline-flex h-14 items-center justify-center rounded-full bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm shadow-accent-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-700">
                    Explore prompts
                  </button>
                  <Link href="/submit" className="inline-flex h-14 items-center justify-center rounded-full border border-border-default bg-surface-card px-6 text-sm font-semibold text-content-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary">
                    Share your prompt
                  </Link>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-content-secondary">
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm dark:bg-white/5">Input/output story</span>
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm dark:bg-white/5">Creator-first prompt packs</span>
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm dark:bg-white/5">Free to browse</span>
            </div>
          </div>

          <div className="relative animate-fade-in-up-delay-1">
            <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_55%)]" />
            <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
              {featured ? <PromptCard prompt={featured} variant="featured" /> : null}
              <div className="grid gap-4 self-end">
                {heroSupport.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 rounded-[32px] border border-white/60 bg-white/72 p-6 shadow-[0_20px_60px_-44px_rgba(145,73,24,0.45)] backdrop-blur dark:border-white/10 dark:bg-white/5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Built for creators first</div>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-content-secondary">
              Start with image transformations, social media systems, and cinematic prompt packs. Then branch into builder guides and study frameworks once you need them.
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

      <section className="px-4 py-18 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Featured creator collections</div>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">Enter through the right visual lane.</h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link key={collection.slug} href={`/search?q=${encodeURIComponent(collection.title)}`} className="group relative overflow-hidden rounded-[30px] border border-border-default/80 bg-surface-card/92 p-5 shadow-[0_22px_70px_-52px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-accent-300">
                <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(242,90,44,0.14),rgba(255,176,102,0.08),transparent)]" />
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Collection</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-content-primary">{collection.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-content-secondary">{collection.description}</p>
                  <div className="mt-5 space-y-2">
                    {collection.prompts.map((prompt) => (
                      <div key={prompt.id} className="rounded-2xl bg-surface-secondary px-3 py-3 text-sm text-content-primary">
                        <div className="line-clamp-1 font-medium">{prompt.title}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-content-muted">{prompt.categorySlugs[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Creator-first categories</div>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">Browse by real use case, not generic taxonomy.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-content-secondary">Each lane below is tuned for the kinds of prompts you said this site will grow around first.</p>
            </div>
            <Link href="/c/trending" className="hidden text-sm font-medium text-content-secondary transition-colors hover:text-content-primary sm:inline-flex">See all browse lanes</Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryCards.map((category) => {
              const highlight = categoryHighlights[category!.slug];
              return (
                <Link key={category!.slug} href={`/c/${category!.slug}`} className="group relative overflow-hidden rounded-[30px] border border-border-default/80 bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-300 hover:shadow-[0_22px_70px_-50px_rgba(243,115,53,0.45)]">
                  <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${highlight?.accentClassName ?? "from-orange-500/20 via-pink-400/10 to-transparent"}`} />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/78 text-content-primary shadow-sm dark:bg-white/10">
                      <CategoryGlyph slug={category!.slug} />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-content-primary">{category!.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-content-secondary">{category!.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(highlight?.sampleOutputs ?? []).map((sample) => (
                        <span key={sample} className="rounded-full bg-surface-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-muted">{sample}</span>
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
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Trending creator prompts</div>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">The prompts that make the site feel alive.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-content-secondary">This mix intentionally favors transformation and creator outcomes first, so the homepage immediately shows what the product is really for.</p>
            </div>
            <Link href="/c/trending" className="text-sm font-medium text-content-secondary transition-colors hover:text-content-primary">Open all trending</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trending.slice(0, 8).map((prompt, index) => (
              <div key={prompt.id} className={index === 0 ? "md:col-span-2 xl:col-span-2" : ""}>
                <PromptCard prompt={prompt} variant={index === 0 ? "featured" : "standard"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] gap-4 rounded-[34px] border border-border-default/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,238,0.92))] p-6 shadow-[0_20px_70px_-48px_rgba(145,73,24,0.45)] dark:bg-[linear-gradient(135deg,rgba(28,24,22,0.96),rgba(22,22,22,0.94))] md:grid-cols-3">
          {[
            ["Find the lane", "Start with transformations, social packs, or prompt systems instead of browsing a dead grid."],
            ["Preview the result", "Use input/output examples and image galleries to judge whether the vibe matches your goal."],
            ["Copy and ship", "Open the prompt, remix it for your own input, and move directly into your preferred model."],
          ].map(([title, body], index) => (
            <div key={title} className="rounded-[24px] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-600 text-sm font-semibold text-white">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-content-primary">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-content-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-18 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] gap-6 rounded-[34px] border border-border-default/80 bg-surface-card/92 p-6 shadow-[0_20px_70px_-48px_rgba(15,23,42,0.22)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Learn and level up</div>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-content-primary sm:text-4xl">A quieter lane for builders, students, and guide-driven prompting.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-content-secondary">
              Software prompting, UPSC-style answer frameworks, and deeper prompting guides should live here so the homepage stays creator-first without hiding the rest of the product.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/blog" className="inline-flex items-center justify-center rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-700">Open blog</Link>
              <Link href="/search?q=debug" className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-semibold text-content-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary">Browse builder prompts</Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {softwareLane.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px] rounded-[38px] border border-border-default/80 bg-[linear-gradient(135deg,rgba(252,104,43,0.96),rgba(241,138,63,0.92))] p-8 text-white shadow-[0_30px_90px_-50px_rgba(196,78,23,0.75)] sm:p-12">
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">Creator submission</div>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] sm:text-5xl">Share a prompt that actually transforms something.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/82">Upload the input, show the output, and help the next creator skip the blank-page feeling with a prompt that has visible payoff.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/submit" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#9e4319] transition-transform duration-200 hover:-translate-y-0.5">Build your prompt page</Link>
              <Link href="/c/image-transform" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10">See transformation prompts</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
