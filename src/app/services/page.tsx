import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "See the product services and future premium directions behind PromptShare.",
};

const services = [
  {
    title: "Prompt Library Access",
    body:
      "Browse a public prompt library built around image transformations, social media workflows, and high-signal prompt discovery.",
  },
  {
    title: "Prompt Pack Curation",
    body:
      "Bundle related prompts into themed packs so creators can move faster across campaigns, visual styles, and repeatable experiments.",
  },
  {
    title: "Prompt Strategy Guides",
    body:
      "Use the blog and learning layer for prompting frameworks, model-specific advice, and practical workflows for builders, students, and marketers.",
  },
  {
    title: "Future Premium Workflows",
    body:
      "Plan for premium features like saved libraries, private collections, deeper creator tools, advanced media organization, and curated member-only packs.",
  },
];

export default function ServicesPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8">
        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Services</div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">
            A free creator library today, with premium workflow layers ready to scale later.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-content-secondary">
            PromptShare is not just a prompt list. It is a growing product system for discovery, learning, visual comparison, and eventually premium creator organization.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-[28px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.2)]"
            >
              <h2 className="text-xl font-semibold text-content-primary">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-content-secondary">{service.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[30px] border border-border-default/80 bg-[linear-gradient(160deg,rgba(242,90,44,0.08),rgba(255,194,122,0.16))] p-6 shadow-[0_18px_50px_-36px_rgba(145,73,24,0.28)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Release direction</div>
              <p className="mt-3 text-sm leading-7 text-content-secondary">
                For this release, the focus is on a strong creator-first browsing experience, cleaner prompt pages, seeded content, and a reliable blog and learning layer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-full bg-content-primary px-5 py-2.5 text-sm font-medium text-surface-primary transition-transform hover:-translate-y-0.5"
              >
                Submit a prompt
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary transition-transform hover:-translate-y-0.5"
              >
                Explore guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
