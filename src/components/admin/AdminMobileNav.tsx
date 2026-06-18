"use client";

import Link from "next/link";
import { useState } from "react";

export function AdminMobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary"
        aria-expanded={open}
      >
        Menu
      </button>
      {open ? (
        <div className="absolute right-4 z-20 mt-2 w-48 rounded-2xl border border-border-default bg-surface-card p-2 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.25)]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
