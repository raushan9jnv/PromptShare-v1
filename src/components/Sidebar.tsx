import Link from "next/link";

import { categories, contentTypes, models } from "@/lib/taxonomy";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-4">
      <div className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </div>
      <div className="mt-2 space-y-1">{children}</div>
    </section>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
    >
      {label}
    </Link>
  );
}

export function Sidebar() {
  const topicCategories = categories.filter((c) => c.slug !== "trending");

  return (
    <aside className="sticky top-[72px] hidden h-[calc(100dvh-72px)] w-64 shrink-0 overflow-y-auto border-r border-zinc-200 bg-zinc-50/60 px-3 sm:block">
      <Section title="Categories">
        {topicCategories.map((c) => (
          <NavItem key={c.slug} href={`/c/${c.slug}`} label={c.name} />
        ))}
      </Section>

      <Section title="Trending">
        <NavItem href="/c/trending" label="Trending" />
      </Section>

      <Section title="Content type">
        {contentTypes.map((c) => (
          <NavItem key={c.slug} href={`/t/${c.slug}`} label={c.name} />
        ))}
      </Section>

      <Section title="Models">
        {models.map((m) => (
          <NavItem key={m.slug} href={`/m/${m.slug}`} label={m.name} />
        ))}
      </Section>
    </aside>
  );
}
