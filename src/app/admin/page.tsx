import { createSupabaseServerClient } from "@/lib/supabase/server";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.24)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">{label}</div>
      <div className="mt-3 font-display text-4xl tracking-[-0.02em] text-content-primary">{value}</div>
    </div>
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

  const stats = [
    { label: "Pending prompts", value: pendingPrompts.count ?? 0 },
    { label: "Approved prompts", value: approvedPrompts.count ?? 0 },
    { label: "Total users", value: totalUsers.count ?? 0 },
    { label: "Pending videos", value: pendingVideos.count ?? 0 },
    { label: "Total videos", value: totalVideos.count ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
