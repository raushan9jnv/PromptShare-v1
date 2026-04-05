import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { listPromptsByModel } from "@/lib/prompts";
import { getModel } from "@/lib/taxonomy";

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return notFound();

  const items = await listPromptsByModel(slug);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">{model.name}</span>
        </nav>

        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Model lane</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">{model.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">Prompts optimized for {model.name}, mixed from seeded creator examples and your live prompt library.</p>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} variant="standard" />
          ))}
        </div>
      </div>
    </div>
  );
}
