"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { categories, contentTypes, models } from "@/lib/taxonomy";

const primaryCategories = ["trending", "image-transform", "social-media", "prompt-packs", "youtube", "marketing"];
const categoryIcons: Record<string, string> = {
  trending: "↗",
  "image-transform": "◐",
  "social-media": "#",
  "prompt-packs": "◫",
  youtube: "▶",
  marketing: "◌",
  design: "✦",
  software: "⌘",
  education: "◎",
  "image-prompts": "◈",
  productivity: "⚡",
  instagram: "○",
  linkedin: "□",
  sql: "◇",
  business: "△",
};

function NavLink({ href, label, count, color, active, icon }: { href: string; label: string; count?: number; color?: string; active: boolean; icon: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm transition-all ${active ? "bg-surface-secondary text-content-primary" : "text-content-secondary hover:bg-surface-secondary hover:text-content-primary"}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color ?? "#E8883A" }}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </span>
      {typeof count === "number" ? <span className="text-xs font-medium text-content-muted">{count}</span> : null}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">{children}</div>;
}

export function SidebarContent() {
  const pathname = usePathname();
  const primary = categories.filter((category) => primaryCategories.includes(category.slug));
  const more = categories.filter((category) => !primaryCategories.includes(category.slug));

  return (
    <nav className="flex h-full flex-col px-3 py-4" aria-label="Sidebar navigation">
      <div className="space-y-6">
        <section>
          <SectionTitle>Browse</SectionTitle>
          <div className="mt-2 space-y-1.5">
            {primary.map((category) => (
              <NavLink
                key={category.slug}
                href={category.slug === "trending" ? "/c/trending" : `/c/${category.slug}`}
                label={category.name}
                count={category.count}
                color={category.color}
                active={pathname === `/c/${category.slug}` || (category.slug === "trending" && pathname === "/c/trending")}
                icon={categoryIcons[category.slug] ?? "•"}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>More categories</SectionTitle>
          <div className="mt-2 space-y-1.5">
            {more.slice(0, 6).map((category) => (
              <NavLink key={category.slug} href={`/c/${category.slug}`} label={category.name} count={category.count} color={category.color} active={pathname === `/c/${category.slug}`} icon={categoryIcons[category.slug] ?? "•"} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Models</SectionTitle>
          <div className="mt-2 space-y-1.5">
            {models.slice(0, 5).map((model) => (
              <NavLink key={model.slug} href={`/m/${model.slug}`} label={model.name} active={pathname === `/m/${model.slug}`} icon="AI" />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Content types</SectionTitle>
          <div className="mt-2 space-y-1.5">
            {contentTypes.map((type) => (
              <NavLink key={type.slug} href={`/t/${type.slug}`} label={type.name} count={type.count} active={pathname === `/t/${type.slug}`} icon={type.slug === "image" ? "IMG" : type.slug === "text" ? "TXT" : type.slug === "video" ? "VID" : "AUX"} />
            ))}
          </div>
        </section>
      </div>
    </nav>
  );
}
