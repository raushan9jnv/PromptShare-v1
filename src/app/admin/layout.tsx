import Link from "next/link";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-content-muted">Admin</span>
          <span className="text-border-default">·</span>
          <Link href="/" className="text-xs text-content-muted transition-colors hover:text-content-primary">← Back to site</Link>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
          Root Admin · {profile.email ?? profile.display_name}
        </span>
      </div>

      <div className="flex gap-6 py-6">
        {/* Sidebar */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <AdminSidebar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
