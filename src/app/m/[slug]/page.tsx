import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByModel } from "@/lib/prompts";
import { getModel } from "@/lib/taxonomy";

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return notFound();

  let items: Awaited<ReturnType<typeof listPromptsByModel>> = [];
  let error: string | null = null;

  try {
    items = await listPromptsByModel(slug);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load prompts.";
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">{model.name}</span>
        </nav>

        <section className="rounded-[32px] border border-border-default/80 bg-surface-card/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Model lane</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">{model.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">
            Prompts optimized for {model.name}. Preview the creative direction here, then open the model and adapt the prompt to your project.
          </p>
          <a href={model.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-700">
            Open {model.name}
          </a>
        </section>

        {error ? <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} variant="standard" />
          ))}
        </div>

        {!error && items.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-10 text-center text-sm text-content-secondary">
            No prompts yet for {model.name}. The first strong prompt here will stand out quickly.
          </div>
        ) : null}
      </div>
    </div>
  );
}

