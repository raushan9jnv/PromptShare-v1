import Image from "next/image";
import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import type { PromptListItem } from "@/lib/prompts";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

type PromptCardVariant = "featured" | "standard" | "compact";

export function PromptCard({
  prompt,
  variant = "standard",
}: {
  prompt: PromptListItem;
  variant?: PromptCardVariant;
}) {
  const category = getCategory(prompt.categorySlugs[0] ?? "");
  const model = getModel(prompt.modelSlugs[0] ?? "");
  const ctype = getContentType(prompt.contentType);
  const blurb = prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 180);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");
  const hasImage = Boolean(prompt.previewImageUrl);
  const imageAspectClass =
    variant === "featured" ? "aspect-[4/3] lg:aspect-[16/12]" : "aspect-[16/10]";
  const containerClass =
    variant === "featured"
      ? "min-h-full rounded-[28px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,241,0.92))] shadow-[0_28px_80px_-44px_rgba(145,73,24,0.45)]"
      : variant === "compact"
        ? "rounded-3xl border border-border-default/80 bg-surface-card/90 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)]"
        : "rounded-[26px] border border-border-default/80 bg-surface-card/95 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.28)]";

  return (
    <article className={`group relative overflow-hidden ${containerClass} card-hover transition-all duration-300`}>
      <Link href={`/p/${prompt.slug}`} aria-label={`Open ${prompt.title}`} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_72%)] opacity-70" />

      {hasImage ? (
        <div className={`relative ${imageAspectClass} w-full overflow-hidden bg-surface-secondary`}>
          <Image
            src={prompt.previewImageUrl!}
            alt=""
            fill
            sizes={variant === "featured" ? "(max-width: 1024px) 100vw, 560px" : "(max-width: 768px) 100vw, 520px"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={isSupabasePublic(prompt.previewImageUrl!)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,40,0.12),rgba(16,24,40,0.72))]" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
            {category ? (
              <span className="rounded-full border border-white/20 bg-white/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                {category.name}
              </span>
            ) : null}
            {model ? (
              <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                {model.name}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            {ctype ? (
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
                {ctype.name} prompt
              </div>
            ) : null}
            <h3 className={`${variant === "featured" ? "text-2xl" : "text-xl"} max-w-xl font-semibold leading-tight tracking-tight`}>
              {prompt.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/84 line-clamp-2">{blurb}</p>
          </div>
        </div>
      ) : null}

      <div className={`relative z-10 ${variant === "compact" ? "p-4" : "p-5 sm:p-6"}`}>
        {!hasImage ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {category ? (
                <span className="rounded-full bg-accent-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-300">
                  {category.name}
                </span>
              ) : null}
              {model ? (
                <span className="rounded-full border border-border-default bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-secondary dark:bg-white/5">
                  {model.name}
                </span>
              ) : null}
              {ctype ? (
                <span className="rounded-full border border-border-default/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                  {ctype.name}
                </span>
              ) : null}
            </div>

            <h3 className={`${variant === "featured" ? "mt-5 text-2xl" : "mt-4 text-xl"} max-w-xl font-semibold tracking-tight text-content-primary`}>
              {prompt.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-content-secondary line-clamp-3">{blurb}</p>
          </>
        ) : null}

        {prompt.authorHandle ? (
          <div className={`${hasImage ? "mt-0" : "mt-4"} text-xs font-medium uppercase tracking-[0.22em] text-content-muted`}>
            Shared by @{prompt.authorHandle}
          </div>
        ) : null}

        {prompt.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {prompt.tags.slice(0, variant === "compact" ? 2 : 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-surface-secondary px-2.5 py-1 text-[11px] font-medium text-content-muted"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="relative z-10 mt-5 flex items-center gap-2 border-t border-border-subtle/90 pt-4">
          <CopyButton text={prompt.body} />
          <Link
            href={`/p/${prompt.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-700"
          >
            Open prompt
          </Link>
        </div>
      </div>
    </article>
  );
}

