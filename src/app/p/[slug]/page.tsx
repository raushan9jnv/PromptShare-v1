import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/CopyButton";
import { MediaShowcase } from "@/components/MediaShowcase";
import { getPromptBySlug } from "@/lib/prompts";
import { getCategory, getContentType, getModel } from "@/lib/taxonomy";

export default async function PromptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return notFound();

  const category = getCategory(prompt.categorySlugs[0] ?? "");
  const model = getModel(prompt.modelSlugs[0] ?? "");
  const ctype = getContentType(prompt.contentType);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
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
          {prompt.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700"
            >
              #{t}
            </span>
          ))}
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{prompt.title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {prompt.excerpt?.trim() || prompt.body.replace(/\s+/g, " ").trim().slice(0, 240)}
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-zinc-800">Prompt</div>
            <CopyButton text={prompt.body} />
          </div>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-900">
            {prompt.body}
          </pre>
          {model ? (
            <div className="mt-4">
              <a
                href={model.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-900"
              >
                Open in {model.name}
              </a>
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-900">Media showcase</div>
          <p className="mt-1 text-sm text-zinc-600">
            Previews you or the author uploaded. We do not generate images or video on the server.
          </p>
          <div className="mt-4">
            <MediaShowcase assets={prompt.assets.map((a) => ({ kind: a.kind, public_url: a.public_url }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
