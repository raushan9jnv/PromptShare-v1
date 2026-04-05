import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "See the product services and future premium directions behind PromptShare.",
};

const services = [
  ["Prompt Library Access", "Browse creator-first prompts for image transformations, social content, and practical AI workflows."],
  ["Prompt Pack Curation", "Organize related prompts into stronger themed sets that creators can reuse quickly."],
  ["Prompt Strategy Guides", "Use the blog for practical prompting guides, model tips, and frameworks."],
  ["Future Premium Workflows", "Saved collections, private packs, better creator tools, and advanced organization can layer in later."]
] as const;

export default function ServicesPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px] space-y-8">
        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Services</div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">Free creator discovery now, premium workflow layers later.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-content-secondary">PromptShare starts as a strong public prompt product, then grows into better curation, private organization, and higher-value creator tools.</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {services.map(([title, body]) => (
            <article key={title} className="rounded-[28px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.2)]">
              <h2 className="text-xl font-semibold text-content-primary">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-content-secondary">{body}</p>
            </article>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/submit" className="inline-flex items-center justify-center rounded-full bg-[#E8883A] px-5 py-2.5 text-sm font-medium text-white">Submit a prompt</Link>
          <Link href="/blog" className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary">Explore guides</Link>
        </div>
      </div>
    </div>
  );
}