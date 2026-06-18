"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CategoryIcon } from "@/components/CategoryIcon";
import { categories } from "@/lib/taxonomy";

const primary = ["trending", "image-transform", "social-media", "prompt-packs", "youtube", "marketing", "design", "software", "education"];

const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

export function CategoryNav() {
  const pathname = usePathname();

  const navItems = [
    { slug: "all", name: "All", color: null, href: "/" },
    ...primary
      .map((slug) => catMap[slug])
      .filter(Boolean)
      .map((c) => ({ slug: c.slug, name: c.name, color: c.color, href: `/c/${c.slug}` })),
    { slug: "more", name: "+ More", color: null, href: "/c/image-prompts" },
  ];

  return (
    <nav
      aria-label="Browse categories"
      className="hide-scrollbar sticky top-[57px] z-20 flex items-stretch gap-0 overflow-x-auto border-b border-border-default bg-surface-card/90 backdrop-blur-md"
    >
      {navItems.map((item) => {
        const isActive = item.slug === "all" ? pathname === "/" : pathname === item.href;

        return (
          <Link
            key={item.slug}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
              isActive
                ? "border-accent-600 text-content-primary dark:border-accent-400"
                : "border-transparent text-content-muted hover:text-content-secondary"
            }`}
          >
            {item.color ? (
              <CategoryIcon slug={item.slug} className="h-3.5 w-3.5" color={isActive ? item.color : undefined} />
            ) : null}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
