import Image from "next/image";
import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import type { PromptListItem } from "@/lib/prompts";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

export type PromptCardVariant = "featured" | "standard" | "compact";

function BookmarkButton() {
  return (
    <button
      type="button"
      aria-label="Save prompt"
      title="Save prompt"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-white/88 text-content-primary transition-all hover:-translate-y-0.5 hover:border-[var(--accent-strong)] dark:bg-black/20"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

export function PromptCard({ prompt, variant = "standard" }: { prompt: PromptListItem; variant?: PromptCardVariant }) {
  const category = getCategory(prompt.categorySlugs[0] ?? "");
  const model = getModel(prompt.modelSlugs[0] ?? "");
  const ctype = getContentType(prompt.contentType);
  const blurb = prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 140);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");
  const imageUrl = prompt.previewImageUrl ?? "/blog/prompt-engineering-101.svg";

  return (
    <article className={`group overflow-hidden rounded-[28px] border border-border-default/80 bg-surface-card shadow-[0_18px_60px_-40px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-strong)] ${variant === "featured" ? "lg:h-full" : ""}`}>
      <Link href={`/p/${prompt.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-secondary">
          <Image src={imageUrl} alt="" fill sizes="(max-width: 1024px) 100vw, 720px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" unoptimized={isSupabasePublic(imageUrl)} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.62))]" />
          <div className="absolute left-4 top-4 flex gap-2">
            {category ? <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">{category.name}</span> : null}
            {ctype ? <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">{ctype.name}</span> : null}
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <CopyButton text={prompt.body} iconOnly />
            <BookmarkButton />
          </div>
        </div>
      </Link>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-semibold tracking-tight text-content-primary ${variant === "featured" ? "text-2xl" : "text-xl"}`}>
              <Link href={`/p/${prompt.slug}`}>{prompt.title}</Link>
            </h3>
            <p className="mt-2 text-sm leading-7 text-content-secondary line-clamp-3">{blurb}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          <div className="text-xs uppercase tracking-[0.2em] text-content-muted">{model?.name ?? "Prompt"}</div>
          <Link href={`/p/${prompt.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-strong)] transition-colors hover:text-content-primary">
            Open
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
