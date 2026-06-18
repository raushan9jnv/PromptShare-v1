import Link from "next/link";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { approvePrompt, rejectPrompt, resetToPending } from "./actions";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  author_handle: string | null;
  category_slugs: string[] | null;
  created_at: string;
  rejection_reason: string | null;
};

const TABS = ["pending", "approved", "rejected"] as const;

const tabStyles = {
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const activeStatus = (TABS as readonly string[]).includes(status ?? "") ? (status as typeof TABS[number]) : "pending";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("id, title, slug, status, author_handle, category_slugs, created_at, rejection_reason")
    .eq("status", activeStatus)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-content-primary">Submissions</h1>
        <Link href="/submit" className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
          + Add prompt
        </Link>
      </div>

      {/* Status tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <a
            key={tab}
            href={`/admin/submissions?status=${tab}`}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeStatus === tab
                ? "bg-accent-600 text-white"
                : "border border-border-default bg-surface-card text-content-secondary hover:text-content-primary"
            }`}
          >
            {tab}
          </a>
        ))}
      </div>

      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default bg-surface-card py-16 text-center text-sm text-content-muted">
          No {activeStatus} submissions.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default bg-surface-secondary text-left text-[11px] font-semibold uppercase tracking-wide text-content-muted">
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 sm:table-cell">Author</th>
                <th className="hidden px-4 py-3 lg:table-cell">Categories</th>
                <th className="hidden px-4 py-3 sm:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {rows.map((row) => (
                <tr key={row.id} className="group transition-colors hover:bg-surface-secondary">
                  <td className="px-4 py-3.5">
                    <Link href={`/p/${row.slug}`} target="_blank" rel="noreferrer" className="font-medium text-content-primary transition-colors hover:text-[var(--accent-strong)]">
                      {row.title}
                    </Link>
                    {row.rejection_reason ? (
                      <div className="mt-1 text-[11px] text-red-500">Reason: {row.rejection_reason}</div>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3.5 text-sm text-content-muted sm:table-cell">
                    @{row.author_handle ?? "user"}
                  </td>
                  <td className="hidden px-4 py-3.5 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(row.category_slugs ?? []).slice(0, 2).map((s) => (
                        <span key={s} className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] text-content-muted">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 text-xs text-content-muted sm:table-cell">
                    {new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {activeStatus !== "approved" ? (
                        <form action={approvePrompt}>
                          <input type="hidden" name="id" value={row.id} />
                          <FormSubmitButton pendingText="..." className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700">
                            Approve
                          </FormSubmitButton>
                        </form>
                      ) : null}

                      {activeStatus !== "rejected" ? (
                        <details className="relative">
                          <summary className="cursor-pointer list-none rounded-lg border border-border-default bg-surface-card px-3 py-1.5 text-xs font-semibold text-content-primary hover:border-red-300">
                            Reject
                          </summary>
                          <form action={rejectPrompt} className="absolute right-0 z-10 mt-2 w-64 space-y-2 rounded-2xl border border-border-default bg-surface-card p-3 shadow-xl">
                            <input type="hidden" name="id" value={row.id} />
                            <textarea
                              name="reason"
                              placeholder="Reason (optional)"
                              className="w-full rounded-xl border border-border-default bg-surface-secondary px-3 py-2 text-xs text-content-primary outline-none"
                              rows={3}
                            />
                            <FormSubmitButton pendingText="..." className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
                              Confirm reject
                            </FormSubmitButton>
                          </form>
                        </details>
                      ) : null}

                      {activeStatus !== "pending" ? (
                        <form action={resetToPending}>
                          <input type="hidden" name="id" value={row.id} />
                          <FormSubmitButton pendingText="..." className="rounded-lg border border-border-default bg-surface-secondary px-3 py-1.5 text-xs font-semibold text-content-primary hover:border-[var(--accent-strong)]">
                            Reset
                          </FormSubmitButton>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
