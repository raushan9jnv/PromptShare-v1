import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/CopyButton";
import { MediaShowcase } from "@/components/MediaShowcase";
import { PromptCard } from "@/components/PromptCard";
import { countPromptsByUserId, getPromptBySlug, listPromptsByCategory, listPromptsByModel, type PromptListItem } from "@/lib/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

function pseudoMetric(input: string, min: number, max: number) {
  const seed = Array.from(input).reduce((total, char) => total + char.charCodeAt(0), 0);
  return min + (seed % (max - min + 1));
}

export default async function PromptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const categories = prompt.categorySlugs.map((item) => getCategory(item)).filter(Boolean);
  const models = prompt.modelSlugs.map((item) => getModel(item)).filter(Boolean);
  const contentType = getContentType(prompt.contentType);
  const summary = prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 220);
  const creator = prompt.authorHandle ? `@${prompt.authorHandle}` : "PromptShare team";
  const isOwner = user?.id === prompt.userId;

  let promptCount = 0;
  try {
    promptCount = await countPromptsByUserId(prompt.userId);
  } catch {
    promptCount = 0;
  }

  let related: PromptListItem[] = [];
  try {
    const primaryCategory = categories[0];
    const primaryModel = models[0];
    if (primaryCategory) related = (await listPromptsByCategory(primaryCategory.slug)).filter((item) => item.slug !== prompt.slug).slice(0, 3);
    if (related.length < 3 && primaryModel) {
      const more = await listPromptsByModel(primaryModel.slug);
      const seen = new Set(related.map((item) => item.id));
      related = [...related, ...more.filter((item) => item.slug !== prompt.slug && !seen.has(item.id)).slice(0, 3 - related.length)];
    }
  } catch {
    related = [];
  }

  const likes = pseudoMetric(prompt.slug, 12, 96);
  const comments = pseudoMetric(prompt.title, 2, 18);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <nav className="mb-6 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="truncate text-content-secondary">{prompt.title}</span>
        </nav>

        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/95 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {contentType ? <span className="rounded-full bg-accent-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-300">{contentType.name}</span> : null}
            {categories.map((category) => <Link key={category!.slug} href={`/c/${category!.slug}`} className="rounded-full border border-border-default bg-surface-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-secondary">{category!.name}</Link>)}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl leading-tight tracking-[-0.035em] text-content-primary sm:text-5xl">{prompt.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">{summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CopyButton text={prompt.body} className="bg-accent-600 text-white hover:bg-accent-700" />
            {models[0] ? <a href={models[0].href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary transition-all hover:-translate-y-0.5">Open in {models[0].name}</a> : null}
            {isOwner ? <Link href={`/p/${prompt.slug}/edit`} className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary transition-all hover:-translate-y-0.5">Edit prompt</Link> : null}
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-border-default/80 bg-surface-card p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)] sm:p-6">
              <MediaShowcase assets={prompt.assets.map((asset) => ({ kind: asset.kind, public_url: asset.public_url }))} />
            </div>

            <div className="rounded-[30px] border border-border-default/80 bg-surface-card shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
              <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4 sm:px-6">
                <div className="text-lg font-semibold text-content-primary">Prompt text</div>
                <CopyButton text={prompt.body} />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap px-5 py-5 font-mono text-sm leading-8 text-content-primary sm:px-6">{prompt.body}</pre>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-border-default/80 bg-surface-card p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
              <div className="text-sm font-semibold text-content-primary">Engagement</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <button type="button" className="rounded-2xl bg-surface-secondary px-4 py-4 text-left transition-colors hover:bg-surface-elevated">
                  <div className="text-content-muted">Likes</div>
                  <div className="mt-1 text-xl font-semibold text-content-primary">{likes}</div>
                </button>
                <button type="button" className="rounded-2xl bg-surface-secondary px-4 py-4 text-left transition-colors hover:bg-surface-elevated">
                  <div className="text-content-muted">Comments</div>
                  <div className="mt-1 text-xl font-semibold text-content-primary">{comments}</div>
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-border-default/80 bg-surface-card p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
              <div className="text-sm font-semibold text-content-primary">Creator</div>
              <div className="mt-4 flex items-center gap-4 rounded-2xl bg-surface-secondary px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-600 text-sm font-semibold text-white">{creator.replace("@", "").slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="font-medium text-content-primary">{creator}</div>
                  <div className="text-sm text-content-secondary">{promptCount} prompts created</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-border-default/80 bg-surface-card p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
              <div className="text-sm font-semibold text-content-primary">Works with</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {models.map((model) => <Link key={model!.slug} href={`/m/${model!.slug}`} className="rounded-full bg-surface-secondary px-3 py-1.5 text-sm text-content-secondary">{model!.name}</Link>)}
              </div>
              <div className="mt-4 text-sm font-semibold text-content-primary">Categories</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => <Link key={category!.slug} href={`/c/${category!.slug}`} className="rounded-full bg-surface-secondary px-3 py-1.5 text-sm text-content-secondary">{category!.name}</Link>)}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <div className="mb-6 text-2xl font-semibold tracking-tight text-content-primary">Related prompts</div>
          {related.length > 0 ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{related.map((item) => <PromptCard key={item.id} prompt={item} variant="compact" />)}</div> : <div className="rounded-[28px] border border-dashed border-border-default bg-surface-card p-8 text-center text-sm text-content-secondary">Related prompts will appear here as the library grows.</div>}
        </section>
      </div>
    </div>
  );
}