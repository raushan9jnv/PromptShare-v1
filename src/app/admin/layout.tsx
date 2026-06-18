import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/models", label: "Models" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Admin</div>
            <h1 className="mt-1 font-display text-3xl tracking-[-0.02em] text-content-primary">Control center</h1>
          </div>
          <AdminMobileNav items={navItems} />
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-24 space-y-1 rounded-[24px] border border-border-default/80 bg-surface-card/94 p-3" aria-label="Admin navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
