import { getCurrentProfile, requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";

import { toggleUserRole } from "./actions";

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "user" | "admin";
  created_at: string;
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const currentProfile = await getCurrentProfile();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  const users = (data ?? []) as ProfileRow[];

  return (
    <div className="space-y-6">
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-[24px] border border-border-default/80 bg-surface-card/94">
        <ul className="divide-y divide-border-subtle">
          {users.map((user) => {
            const isSelf = user.id === currentProfile?.id;
            const nextRole = user.role === "admin" ? "user" : "admin";
            return (
              <li key={user.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-content-primary">{user.display_name ?? "—"}</div>
                  <div className="mt-1 text-xs text-content-muted">{user.email ?? "no email on file"}</div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${user.role === "admin" ? "bg-[var(--accent-strong)] text-white" : "border border-border-default text-content-secondary"}`}>
                    {user.role}
                  </span>
                  {isSelf && user.role === "admin" ? (
                    <span className="rounded-full border border-border-default px-4 py-2 text-xs font-semibold text-content-muted">
                      Can&apos;t demote self
                    </span>
                  ) : (
                    <form action={toggleUserRole}>
                      <input type="hidden" name="id" value={user.id} />
                      <input type="hidden" name="next_role" value={nextRole} />
                      <FormSubmitButton
                        pendingText="..."
                        className="rounded-full border border-border-default bg-surface-secondary px-4 py-2 text-xs font-semibold text-content-primary transition-colors hover:border-[var(--accent-strong)]"
                      >
                        {`Make ${nextRole}`}
                      </FormSubmitButton>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
