import Image from "next/image";
import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import type { PromptListItem } from "@/lib/prompts";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

export function PromptCard({ prompt }: { prompt: PromptListItem }) {
  const category = getCategory(prompt.categorySlugs[0] ?? "");
  const model = getModel(prompt.modelSlugs[0] ?? "");
  const ctype = getContentType(prompt.contentType);
  const blurb = prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 180);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {prompt.previewImageUrl ? (
        <Link href={`/p/${prompt.slug}`} className="block">
          <div className="relative aspect-[16/9] w-full border-b border-zinc-100 bg-zinc-100">
            <Image
              src={prompt.previewImageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
              unoptimized={isSupabasePublic(prompt.previewImageUrl)}
            />
          </div>
        </Link>
      ) : null}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          {ctype ? (
            <Link
              href={`/t/${ctype.slug}`}
              className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-900 hover:bg-violet-100"
            >
              {ctype.name}
            </Link>
          ) : null}
          {category ? (
            <Link
              href={`/c/${category.slug}`}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {category.name}
            </Link>
          ) : null}
          {model ? (
            <Link
              href={`/m/${model.slug}`}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {model.name}
            </Link>
          ) : null}
          {prompt.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-3">
          <Link
            href={`/p/${prompt.slug}`}
            className="text-lg font-semibold tracking-tight text-zinc-950"
          >
            {prompt.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{blurb}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyButton text={prompt.body} />
          <Link
            href={`/p/${prompt.slug}`}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
