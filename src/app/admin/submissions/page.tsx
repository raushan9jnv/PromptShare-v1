import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";

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

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const activeStatus = (TABS as readonly string[]).includes(status ?? "") ? (status as string) : "pending";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("id, title, slug, status, author_handle, category_slugs, created_at, rejection_reason")
    .eq("status", activeStatus)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <a
            key={tab}
            href={`/admin/submissions?status=${tab}`}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeStatus === tab
                ? "bg-[var(--accent-strong)] text-white"
                : "border border-border-default bg-surface-card text-content-secondary hover:text-content-primary"
            }`}
          >
            {tab}
          </a>
        ))}
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-[24px] border border-border-default/80 bg-surface-card/94">
        {rows.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-content-muted">No {activeStatus} prompts.</div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-content-primary">{row.title}</div>
                  <div className="mt-1 text-xs text-content-muted">
                    @{row.author_handle ?? "user"} · {(row.category_slugs ?? []).join(", ") || "uncategorized"} ·{" "}
                    {new Date(row.created_at).toLocaleDateString()}
                  </div>
                  <a href={`/p/${row.slug}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-medium text-[var(--accent-strong)] hover:underline">
                    View prompt →
                  </a>
                  {row.rejection_reason ? (
                    <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-800">Reason: {row.rejection_reason}</div>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {activeStatus !== "approved" ? (
                    <form action={approvePrompt}>
                      <input type="hidden" name="id" value={row.id} />
                      <FormSubmitButton pendingText="Approving..." className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700">
                        Approve
                      </FormSubmitButton>
                    </form>
                  ) : null}

                  {activeStatus !== "rejected" ? (
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded-full border border-border-default bg-surface-secondary px-4 py-2 text-xs font-semibold text-content-primary">
                        Reject
                      </summary>
                      <form action={rejectPrompt} className="absolute right-0 z-10 mt-2 w-64 space-y-2 rounded-2xl border border-border-default bg-surface-card p-3 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.25)]">
                        <input type="hidden" name="id" value={row.id} />
                        <textarea
                          name="reason"
                          placeholder="Reason (optional)"
                          className="w-full rounded-xl border border-border-default bg-surface-secondary px-3 py-2 text-xs text-content-primary outline-none"
                          rows={3}
                        />
                        <FormSubmitButton pendingText="Rejecting..." className="w-full rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700">
                          Confirm reject
                        </FormSubmitButton>
                      </form>
                    </details>
                  ) : null}

                  {activeStatus !== "pending" ? (
                    <form action={resetToPending}>
                      <input type="hidden" name="id" value={row.id} />
                      <FormSubmitButton pendingText="..." className="rounded-full border border-border-default bg-surface-secondary px-4 py-2 text-xs font-semibold text-content-primary transition-colors hover:text-content-primary">
                        Reset to pending
                      </FormSubmitButton>
                    </form>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
