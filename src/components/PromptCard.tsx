import Image from "next/image";
import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import type { PromptListItem } from "@/lib/prompts";
import { getCategory, getContentType } from "@/lib/taxonomy";

export type PromptCardVariant = "featured" | "standard" | "compact";

// Deterministic gradient per slug so every text-only card has a distinct colour
function gradientForSlug(slug: string) {
  const h = Array.from(slug).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${h}, 55%, 92%)`;
}

const tagStyles: Record<string, string> = {
  "image-transform": "bg-accent-50 text-accent-700 dark:bg-accent-800 dark:text-accent-200",
  "social-media":    "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  youtube:           "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  marketing:         "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  design:            "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  software:          "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  education:         "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
};

const defaultTag = "bg-surface-secondary text-content-secondary";

function Tag({ slug, name }: { slug: string; name: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${tagStyles[slug] ?? defaultTag}`}>
      {name}
    </span>
  );
}

export function PromptCard({
  prompt,
  variant = "standard",
  priority = false,
}: {
  prompt: PromptListItem;
  variant?: PromptCardVariant;
  priority?: boolean;
}) {
  const category = getCategory(prompt.categorySlugs[0] ?? "");
  const ctype = getContentType(prompt.contentType);
  const hasImage = !!prompt.previewImageUrl;
  const aspectClass = variant === "featured" ? "aspect-[16/7]" : "aspect-[4/3]";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border-default bg-surface-card transition-colors hover:border-[var(--accent-strong)]">
      <Link href={`/p/${prompt.slug}`} className="block">
        <div className={`relative overflow-hidden ${aspectClass}`}>
          {hasImage ? (
            <Image
              src={prompt.previewImageUrl!}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized={prompt.previewImageUrl!.includes("/storage/v1/object/public/")}
              priority={priority}
            />
          ) : (
            // No image: show a text preview on a soft gradient background
            <div
              className="flex h-full w-full items-start p-4"
              style={{ background: `linear-gradient(135deg, ${gradientForSlug(prompt.slug)} 0%, #f9f9fb 100%)` }}
            >
              {category ? (
                <span className="mr-2 mt-0.5 shrink-0 text-2xl">{category.emoji}</span>
              ) : null}
              <p className="line-clamp-4 font-mono text-[11px] leading-relaxed text-zinc-600">
                {prompt.body}
              </p>
            </div>
          )}
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton text={prompt.body} iconOnly />
      </div>

      <div className="p-3">
        <div className="mb-2 flex flex-wrap gap-1">
          {category ? <Tag slug={category.slug} name={category.name} /> : null}
          {ctype ? <Tag slug={ctype.slug} name={ctype.name} /> : null}
        </div>

        <Link href={`/p/${prompt.slug}`}>
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-content-primary transition-colors group-hover:text-[var(--accent-strong)]">
            {prompt.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-content-muted">
            {prompt.authorHandle ? `@${prompt.authorHandle}` : "PromptShare"}
          </span>
          {prompt.modelSlugs[0] ? (
            <span className="text-[11px] text-content-muted capitalize">{prompt.modelSlugs[0]}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
