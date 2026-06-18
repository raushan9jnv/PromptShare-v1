"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: string };

const navItems: NavItem[] = [
  { href: "/admin",             label: "Dashboard",   icon: "⬡" },
  { href: "/admin/submissions", label: "Submissions", icon: "📥" },
  { href: "/admin/users",       label: "Users",       icon: "👥" },
  { href: "/admin/categories",  label: "Categories",  icon: "🗂" },
  { href: "/admin/models",      label: "Models",      icon: "🤖" },
  { href: "/admin/tags",        label: "Tags",        icon: "🏷" },
  { href: "/admin/videos",      label: "Videos",      icon: "🎬" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[57px] space-y-0.5" aria-label="Admin navigation">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-accent-600 font-medium text-white"
                : "text-content-secondary hover:bg-surface-secondary hover:text-content-primary"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
