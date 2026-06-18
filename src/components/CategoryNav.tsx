"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { categories } from "@/lib/taxonomy";

const primary = ["trending", "image-transform", "social-media", "prompt-packs", "youtube", "marketing", "design", "software", "education"];

const icons: Record<string, string> = {
  trending: "↗",
  "image-transform": "◐",
  "social-media": "#",
  "prompt-packs": "⊞",
  youtube: "▶",
  marketing: "◎",
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

export function CategoryNav() {
  const pathname = usePathname();

  const navItems = [
    { slug: "all", name: "All", href: "/" },
    ...primary
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter(Boolean)
      .map((c) => ({ slug: c!.slug, name: c!.name, href: `/c/${c!.slug}` })),
    { slug: "more", name: "+ More", href: "/c/image-prompts" },
  ];

  return (
    <nav
      aria-label="Browse categories"
      className="hide-scrollbar sticky top-[57px] z-20 flex items-stretch gap-0 overflow-x-auto border-b border-border-default bg-surface-card/90 backdrop-blur-md"
    >
      {navItems.map((item) => {
        const isActive =
          item.slug === "all"
            ? pathname === "/"
            : pathname === item.href;

        return (
          <Link
            key={item.slug}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 border-b-[1.5px] px-4 py-3 text-xs font-medium transition-colors ${
              isActive
                ? "border-accent-600 text-content-primary dark:border-accent-400"
                : "border-transparent text-content-muted hover:text-content-secondary"
            }`}
          >
            {icons[item.slug] ? (
              <span className="text-[10px] opacity-60">{icons[item.slug]}</span>
            ) : null}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
