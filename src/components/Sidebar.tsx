"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { categories, contentTypes, models } from "@/lib/taxonomy";

function RailIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/70 text-[12px] font-semibold text-content-primary shadow-sm dark:bg-white/8">
      {children}
    </span>
  );
}

function TopItem({ href, label, badge, active }: { href: string; label: string; badge: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-[22px] px-3 py-3 transition-all duration-200 ${
        active
          ? "bg-[linear-gradient(135deg,rgba(242,90,44,0.12),rgba(255,176,102,0.08))] text-content-primary shadow-[0_16px_40px_-28px_rgba(145,73,24,0.35)]"
          : "text-content-secondary hover:bg-white/55 hover:text-content-primary dark:hover:bg-white/5"
      }`}
    >
      <RailIcon>{badge}</RailIcon>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
      </div>
    </Link>
  );
}

function SectionButton({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted transition-colors hover:text-content-primary"
    >
      <span>{label}</span>
      <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>⌄</span>
    </button>
  );
}

function MinorItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl px-3 py-2.5 text-sm transition-colors ${
        active ? "bg-white/70 text-content-primary dark:bg-white/8" : "text-content-secondary hover:bg-white/55 hover:text-content-primary dark:hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

export function SidebarContent() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState({
    more: false,
    models: false,
    types: false,
  });

  const moreCategories = categories.filter((category) =>
    !["trending", "image-transform", "social-media", "prompt-packs"].includes(category.slug),
  );

  return (
    <nav className="flex h-full flex-col px-3 py-4" aria-label="Creator vault navigation">
      <div className="rounded-[28px] border border-white/60 bg-white/55 p-3 shadow-[0_18px_50px_-36px_rgba(145,73,24,0.35)] backdrop-blur dark:border-white/8 dark:bg-white/4">
        <div className="px-2 pb-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-content-muted">Browse</div>
          <div className="mt-2 text-sm leading-6 text-content-secondary">A calmer rail for creators, packs, and guided learning.</div>
        </div>

        <div className="space-y-1.5">
          <TopItem href="/" label="Home" badge="01" active={pathname === "/"} />
          <TopItem href="/c/trending" label="Trending" badge="02" active={pathname === "/c/trending"} />
          <TopItem href="/c/image-transform" label="Image Transform" badge="03" active={pathname === "/c/image-transform"} />
          <TopItem href="/c/social-media" label="Social Media" badge="04" active={pathname === "/c/social-media"} />
          <TopItem href="/c/prompt-packs" label="Prompt Packs" badge="05" active={pathname === "/c/prompt-packs"} />
          <TopItem href="/blog" label="Blog / Learn" badge="06" active={pathname.startsWith("/blog")} />
          <TopItem href="/submit" label="Submit" badge="07" active={pathname === "/submit"} />
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-border-default/70 bg-surface-card/86 p-2 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
        <SectionButton
          label="More Categories"
          open={openSections.more}
          onToggle={() => setOpenSections((prev) => ({ ...prev, more: !prev.more }))}
        />
        {openSections.more ? (
          <div className="space-y-1 px-1 pb-2">
            {moreCategories.map((category) => (
              <MinorItem key={category.slug} href={`/c/${category.slug}`} label={category.name} active={pathname === `/c/${category.slug}`} />
            ))}
          </div>
        ) : null}

        <SectionButton
          label="Models"
          open={openSections.models}
          onToggle={() => setOpenSections((prev) => ({ ...prev, models: !prev.models }))}
        />
        {openSections.models ? (
          <div className="space-y-1 px-1 pb-2">
            {models.map((model) => (
              <MinorItem key={model.slug} href={`/m/${model.slug}`} label={model.name} active={pathname === `/m/${model.slug}`} />
            ))}
          </div>
        ) : null}

        <SectionButton
          label="Content Types"
          open={openSections.types}
          onToggle={() => setOpenSections((prev) => ({ ...prev, types: !prev.types }))}
        />
        {openSections.types ? (
          <div className="space-y-1 px-1 pb-2">
            {contentTypes.map((type) => (
              <MinorItem key={type.slug} href={`/t/${type.slug}`} label={type.name} active={pathname === `/t/${type.slug}`} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-auto px-2 pt-4 text-xs leading-6 text-content-muted">
        Free-to-browse today. Premium organization, saved collections, and creator tools come later.
      </div>
    </nav>
  );
}
