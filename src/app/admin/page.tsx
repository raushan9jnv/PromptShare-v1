import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type StatCardProps = { label: string; value: number; href: string; icon: string; color: string };

function StatCard({ label, value, href, icon, color }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-border-default bg-surface-card p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-strong)] hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${color}`}>
          {label}
        </span>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-content-primary">{value.toLocaleString()}</div>
        <div className="mt-0.5 text-xs text-content-muted">View all →</div>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [pendingPrompts, approvedPrompts, totalUsers, pendingVideos, totalVideos] = await Promise.all([
    supabase.from("prompts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("prompts").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("videos").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("videos").select("id", { count: "exact", head: true }),
  ]);

  const stats: StatCardProps[] = [
    { label: "Pending review", value: pendingPrompts.count ?? 0, href: "/admin/submissions?status=pending", icon: "📥", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
    { label: "Live prompts",   value: approvedPrompts.count ?? 0, href: "/admin/submissions?status=approved", icon: "✅", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
    { label: "Total users",    value: totalUsers.count ?? 0,      href: "/admin/users",                       icon: "👥", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
    { label: "Pending videos", value: pendingVideos.count ?? 0,   href: "/admin/videos",                      icon: "🎬", color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" },
    { label: "Total videos",   value: totalVideos.count ?? 0,     href: "/admin/videos",                      icon: "📹", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-content-primary">Overview</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-8 rounded-2xl border border-border-default bg-surface-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-content-primary">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/submissions?status=pending" className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
            Review submissions
          </Link>
          <Link href="/submit" className="rounded-xl border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary transition-colors hover:border-[var(--accent-strong)]">
            Add prompt (auto-approved)
          </Link>
          <Link href="/admin/users" className="rounded-xl border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary transition-colors hover:border-[var(--accent-strong)]">
            Manage users
          </Link>
        </div>
      </div>
    </div>
  );
}
