import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what PromptShare is building and why the product is designed for creators first.",
};

const pillars = [
  {
    title: "What we solve",
    body: "Most prompt libraries feel empty or hard to trust. PromptShare is built to make prompt discovery feel visual, fast, and worth opening.",
  },
  {
    title: "Who it is for",
    body: "Creators come first: image transformations, social content, and prompt packs. Builders, students, and marketers are strong secondary lanes.",
  },
  {
    title: "What comes next",
    body: "The library stays free to browse. Later we can add premium packs, saved collections, deeper creator profiles, and better workflow organization.",
  }
];

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px] space-y-8">
        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">About PromptShare</div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">A creator-first prompt library built around visible results.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-content-secondary">PromptShare is designed to help people discover prompts faster, preview what they are getting, and reuse proven workflows without the dead-directory feeling.</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[28px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.2)]">
              <h2 className="text-xl font-semibold text-content-primary">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-content-secondary">{pillar.body}</p>
            </article>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/services" className="inline-flex items-center justify-center rounded-full bg-[#E8883A] px-5 py-2.5 text-sm font-medium text-white">View services</Link>
          <Link href="/blog" className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-5 py-2.5 text-sm font-medium text-content-primary">Read the blog</Link>
        </div>
      </div>
    </div>
  );
}