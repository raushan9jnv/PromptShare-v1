import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/CopyButton";
import { LikeButton } from "@/components/LikeButton";
import { MediaShowcase } from "@/components/MediaShowcase";
import { PromptCard } from "@/components/PromptCard";
import { countPromptsByUserId, getPromptBySlug, listPromptsByCategory, listPromptsByModel, type PromptListItem } from "@/lib/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

export default async function PromptPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { slug } = await params;
  const { submitted } = await searchParams;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const categories = prompt.categorySlugs.map((s) => getCategory(s)).filter(Boolean);
  const models = prompt.modelSlugs.map((s) => getModel(s)).filter(Boolean);
  const contentType = getContentType(prompt.contentType);
  const summary = prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 220);
  const creator = prompt.authorHandle ? `@${prompt.authorHandle}` : "PromptShare team";
  const isOwner = user?.id === prompt.userId;

  // Check if current user has liked this prompt
  let userHasLiked = false;
  if (user) {
    const { data } = await supabase
      .from("prompt_likes")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("prompt_id", prompt.id)
      .maybeSingle();
    userHasLiked = !!data;
  }

  let promptCount = 0;
  try { promptCount = await countPromptsByUserId(prompt.userId); } catch { promptCount = 0; }

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
  } catch { related = []; }

  return (
    <div className="pb-16">
      {submitted && isOwner ? (
        <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          Thanks! Your prompt was submitted and is pending review.
        </div>
      ) : null}

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-5 flex items-center gap-1.5 text-xs text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          {categories[0] ? (
            <>
              <Link href={`/c/${categories[0].slug}`} className="transition-colors hover:text-content-primary">{categories[0].name}</Link>
              <span>/</span>
            </>
          ) : null}
          <span className="truncate text-content-secondary">{prompt.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {contentType ? (
                <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-[11px] font-medium text-accent-700 dark:bg-accent-800 dark:text-accent-200">
                  {contentType.name}
                </span>
              ) : null}
              {categories.map((cat) => (
                <Link key={cat!.slug} href={`/c/${cat!.slug}`} className="rounded-full border border-border-default bg-surface-secondary px-2.5 py-0.5 text-[11px] text-content-secondary transition-colors hover:border-[var(--accent-strong)]">
                  {cat!.name}
                </Link>
              ))}
            </div>

            <h1 className="text-2xl font-medium leading-snug tracking-[-0.03em] text-content-primary sm:text-3xl">{prompt.title}</h1>
            <p className="text-sm leading-7 text-content-secondary">{summary}</p>

            <div className="flex flex-wrap gap-2">
              <CopyButton text={prompt.body} className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" />
              <LikeButton
                promptId={prompt.id}
                promptSlug={prompt.slug}
                initialLiked={userHasLiked}
                initialCount={prompt.likesCount}
                isLoggedIn={!!user}
              />
              {models[0] ? (
                <a href={models[0].href} target="_blank" rel="noreferrer" className="rounded-xl border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary transition-colors hover:border-[var(--accent-strong)]">
                  Open in {models[0].name}
                </a>
              ) : null}
              {isOwner ? (
                <Link href={`/p/${prompt.slug}/edit`} className="rounded-xl border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary transition-colors hover:border-[var(--accent-strong)]">
                  Edit
                </Link>
              ) : null}
            </div>

            {prompt.assets.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card p-4">
                <MediaShowcase assets={prompt.assets.map((a) => ({ kind: a.kind, public_url: a.public_url }))} />
              </div>
            ) : null}

            <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card">
              <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
                <span className="text-sm font-medium text-content-primary">Prompt text</span>
                <CopyButton text={prompt.body} />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 font-mono text-sm leading-7 text-content-primary">{prompt.body}</pre>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[113px] lg:self-start">
            <div className="rounded-xl border border-border-default bg-surface-card p-4">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-content-muted">Stats</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-surface-secondary p-3 text-center">
                  <div className="text-lg font-medium text-content-primary">{prompt.likesCount}</div>
                  <div className="text-[10px] text-content-muted">Likes</div>
                </div>
                <div className="rounded-lg bg-surface-secondary p-3 text-center">
                  <div className="text-lg font-medium text-content-primary">{promptCount}</div>
                  <div className="text-[10px] text-content-muted">By creator</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-default bg-surface-card p-4">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-content-muted">Creator</div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-50 text-sm font-medium text-accent-700 dark:bg-accent-800 dark:text-accent-200">
                  {creator.replace("@", "").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-content-primary">{creator}</div>
                  <div className="text-xs text-content-muted">{promptCount} prompts</div>
                </div>
              </div>
            </div>

            {models.length > 0 || categories.length > 0 ? (
              <div className="space-y-3 rounded-xl border border-border-default bg-surface-card p-4">
                {models.length > 0 ? (
                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-content-muted">Works with</div>
                    <div className="flex flex-wrap gap-1.5">
                      {models.map((m) => (
                        <Link key={m!.slug} href={`/m/${m!.slug}`} className="rounded-lg border border-border-default bg-surface-secondary px-2 py-1 text-xs text-content-secondary transition-colors hover:border-[var(--accent-strong)]">
                          {m!.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                {categories.length > 0 ? (
                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-content-muted">Categories</div>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <Link key={cat!.slug} href={`/c/${cat!.slug}`} className="rounded-lg border border-border-default bg-surface-secondary px-2 py-1 text-xs text-content-secondary transition-colors hover:border-[var(--accent-strong)]">
                          {cat!.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {related.length > 0 ? (
              <div className="rounded-xl border border-border-default bg-surface-card p-4">
                <div className="mb-3 text-xs font-medium uppercase tracking-wide text-content-muted">Related prompts</div>
                <div className="space-y-3">
                  {related.map((item) => (
                    <Link key={item.id} href={`/p/${item.slug}`} className="group flex items-start gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border-default bg-surface-secondary" />
                      <div className="text-xs font-medium leading-snug text-content-primary line-clamp-2 transition-colors group-hover:text-[var(--accent-strong)]">{item.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
