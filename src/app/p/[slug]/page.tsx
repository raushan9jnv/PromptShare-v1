import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/CopyButton";
import { MediaShowcase } from "@/components/MediaShowcase";
import { PromptCard } from "@/components/PromptCard";
import { getPromptBySlug, listPromptsByCategory, listPromptsByModel } from "@/lib/prompts";
import type { PromptListItem } from "@/lib/prompts";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

export default async function PromptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return notFound();

  const allCategories = prompt.categorySlugs.map((s) => getCategory(s)).filter(Boolean);
  const allModels = prompt.modelSlugs.map((s) => getModel(s)).filter(Boolean);
  const ctype = getContentType(prompt.contentType);
  const mainModel = allModels[0] ?? null;
  const primaryCategory = allCategories[0] ?? null;

  let related: PromptListItem[] = [];
  try {
    if (primaryCategory) {
      related = (await listPromptsByCategory(primaryCategory.slug)).filter((item) => item.slug !== prompt.slug).slice(0, 3);
    }

    if (related.length < 3 && mainModel) {
      const byModel = await listPromptsByModel(mainModel.slug);
      const seen = new Set(related.map((item) => item.id));
      related = [
        ...related,
        ...byModel.filter((item) => item.slug !== prompt.slug && !seen.has(item.id)).slice(0, 3 - related.length),
      ];
    }
  } catch {
    related = [];
  }

  const summary = prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 220);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <nav className="mb-6 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          {primaryCategory ? (
            <>
              <Link href={`/c/${primaryCategory.slug}`} className="transition-colors hover:text-content-primary">
                {primaryCategory.name}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="truncate text-content-secondary">{prompt.title}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[36px] border border-border-default/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,248,241,0.92))] p-6 shadow-[0_30px_90px_-52px_rgba(145,73,24,0.45)] dark:bg-[linear-gradient(135deg,rgba(30,25,23,0.98),rgba(22,22,22,0.96))] lg:p-8">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(255,186,124,0.28),transparent_55%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {ctype ? (
                  <span className="rounded-full bg-accent-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
                    {ctype.name} prompt
                  </span>
                ) : null}
                {allCategories.map((category) => (
                  <Link
                    key={category!.slug}
                    href={`/c/${category!.slug}`}
                    className="rounded-full border border-border-default bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-secondary transition-colors hover:text-content-primary dark:bg-white/5"
                  >
                    {category!.name}
                  </Link>
                ))}
                {allModels.map((model) => (
                  <Link
                    key={model!.slug}
                    href={`/m/${model!.slug}`}
                    className="rounded-full border border-border-default bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-secondary transition-colors hover:text-content-primary dark:bg-white/5"
                  >
                    {model!.name}
                  </Link>
                ))}
              </div>

              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[0.98] tracking-[-0.035em] text-content-primary sm:text-5xl lg:text-6xl">
                {prompt.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-content-secondary">
                {prompt.authorHandle ? (
                  <span className="rounded-full bg-surface-secondary px-3 py-1.5">Shared by @{prompt.authorHandle}</span>
                ) : null}
                <span className="rounded-full bg-surface-secondary px-3 py-1.5">Best for quick remixing</span>
                {mainModel ? <span className="rounded-full bg-surface-secondary px-3 py-1.5">Works with {mainModel.name}</span> : null}
              </div>

              <p className="mt-6 max-w-3xl text-base leading-8 text-content-secondary">{summary}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CopyButton text={prompt.body} variant="prominent" />
                {mainModel ? (
                  <a
                    href={mainModel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary"
                  >
                    Open in {mainModel.name}
                  </a>
                ) : null}
              </div>

              {prompt.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-border-default/80 bg-surface-card/85 p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Prompt cockpit</div>
                <div className="mt-4 space-y-3">
                  <CopyButton text={prompt.body} variant="prominent" />
                  {allModels.map((model) => (
                    <a
                      key={model!.slug}
                      href={model!.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center rounded-full border border-border-default bg-surface-card px-4 py-2.5 text-sm font-medium text-content-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary"
                    >
                      Open in {model!.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-border-default/80 bg-surface-card/85 p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Best for</div>
                <p className="mt-3 text-sm leading-7 text-content-secondary">
                  Use this prompt as a starting point, then swap in your topic, tone, and creative constraints before sending it to your model.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
          <section className="space-y-8">
            <div className="rounded-[32px] border border-border-default/80 bg-surface-card/92 p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.28)] sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Preview gallery</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-content-primary">See the outcome style first.</h2>
                </div>
              </div>
              <div className="mt-6">
                <MediaShowcase assets={prompt.assets.map((asset) => ({ kind: asset.kind, public_url: asset.public_url }))} />
              </div>
            </div>

            <div className="rounded-[32px] border border-border-default/80 bg-surface-card/92 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4 sm:px-6">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Prompt</div>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-content-primary">Copy, remix, and run.</h2>
                </div>
                <CopyButton text={prompt.body} />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap px-5 py-5 font-mono text-sm leading-8 text-content-primary sm:px-6">
                {prompt.body}
              </pre>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-[28px] border border-border-default/80 bg-surface-card/88 p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.28)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Details</div>
                <dl className="mt-4 space-y-4 text-sm">
                  {ctype ? (
                    <div>
                      <dt className="text-content-muted">Type</dt>
                      <dd className="mt-1 font-medium text-content-primary">{ctype.name}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-content-muted">Categories</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {allCategories.map((category) => (
                        <Link key={category!.slug} href={`/c/${category!.slug}`} className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-content-secondary">
                          {category!.name}
                        </Link>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-content-muted">Works with</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {allModels.map((model) => (
                        <Link key={model!.slug} href={`/m/${model!.slug}`} className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-content-secondary">
                          {model!.name}
                        </Link>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[28px] border border-border-default/80 bg-surface-card/88 p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.28)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Next additions</div>
                <div className="mt-4 space-y-2 text-sm text-content-secondary">
                  <p>Expected output guidance</p>
                  <p>Customization tips</p>
                  <p>Save and collect later</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Related prompts</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-content-primary">Keep browsing in the same zone.</h2>
            </div>
          </div>

          {related.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <PromptCard key={item.id} prompt={item} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-border-default bg-surface-card p-8 text-center text-sm text-content-secondary">
              Related prompts will appear here as the library grows.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}



