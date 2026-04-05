import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what PromptShare is building and why the product is designed for creators first.",
};

const principles = [
  "Make prompt discovery feel visual, useful, and trustworthy.",
  "Help creators see likely outcomes before they copy a prompt.",
  "Keep the product free and approachable first, then layer premium workflow features later.",
];

const pillars = [
  {
    title: "What we solve",
    body:
      "Most prompt directories feel empty, generic, or hard to trust. PromptShare is built to make prompts easier to browse, compare, and reuse with stronger previews and clearer structure.",
  },
  {
    title: "Who it serves",
    body:
      "Our first audience is creators working on image transformations, social content, design workflows, and visual experiments. Builders, marketers, and students matter too, but creators lead the product story.",
  },
  {
    title: "Where it goes next",
    body:
      "Today the product is free to browse and contribute to. Later we can add premium collections, saved libraries, creator profiles, prompt packs, and advanced organization without changing the core idea.",
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8">
        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">About PromptShare</div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">
            A creator-first prompt library built around visible results, not dead lists.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-content-secondary">
            We are designing PromptShare as a place where people can discover prompts faster, preview what they might get, and reuse good workflows with more confidence. The product starts small and free, but it is being shaped for a much richer premium future.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[28px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.2)]"
            >
              <h2 className="text-xl font-semibold text-content-primary">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-content-secondary">{pillar.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.2)] sm:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Principles</div>
            <div className="mt-4 space-y-4">
              {principles.map((principle) => (
                <div key={principle} className="rounded-2xl bg-surface-secondary px-4 py-4 text-sm leading-7 text-content-secondary">
                  {principle}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-border-default/80 bg-[linear-gradient(160deg,rgba(242,90,44,0.08),rgba(255,194,122,0.16))] p-6 shadow-[0_18px_50px_-36px_rgba(145,73,24,0.28)] sm:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Free now, premium later</div>
            <p className="mt-4 text-sm leading-7 text-content-secondary">
              The public library stays open and useful. Premium layers can focus on organization, saved collections, creator tools, advanced prompt packs, and guided workflows for people who want more depth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-content-primary px-5 py-2.5 text-sm font-medium text-surface-primary transition-transform hover:-translate-y-0.5"
              >
                View services
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary transition-transform hover:-translate-y-0.5"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
