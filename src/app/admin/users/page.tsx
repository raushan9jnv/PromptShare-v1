import { getCurrentProfile, requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";

import { setUserRole } from "./actions";

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "user" | "editor" | "admin";
  created_at: string;
};

const roleStyles = {
  admin:  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  editor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  user:   "bg-surface-secondary text-content-muted",
};

const roleLabels = {
  admin:  "Root Admin",
  editor: "Editor",
  user:   "User",
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const currentProfile = await getCurrentProfile();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  const users = (data ?? []) as ProfileRow[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-content-primary">Users</h1>
        <p className="mt-1 text-xs text-content-muted">
          <strong>Root Admin</strong> — full access, can approve/reject, manage everything. &nbsp;
          <strong>Editor</strong> — can submit prompts (auto-approved), no admin panel access. &nbsp;
          <strong>User</strong> — standard member.
        </p>
      </div>

      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default bg-surface-secondary text-left text-[11px] font-semibold uppercase tracking-wide text-content-muted">
              <th className="px-4 py-3">User</th>
              <th className="hidden px-4 py-3 sm:table-cell">Joined</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Change role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {users.map((user) => {
              const isSelf = user.id === currentProfile?.id;
              return (
                <tr key={user.id} className="transition-colors hover:bg-surface-secondary">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">
                        {(user.email?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-content-primary">{user.display_name ?? "—"}</div>
                        <div className="text-[11px] text-content-muted">{user.email ?? "no email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 text-xs text-content-muted sm:table-cell">
                    {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleStyles[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      {isSelf && user.role === "admin" ? (
                        <span className="text-xs text-content-muted">You</span>
                      ) : (
                        (["user", "editor", "admin"] as const)
                          .filter((r) => r !== user.role)
                          .map((targetRole) => (
                            <form key={targetRole} action={setUserRole}>
                              <input type="hidden" name="id" value={user.id} />
                              <input type="hidden" name="next_role" value={targetRole} />
                              <FormSubmitButton
                                pendingText="..."
                                className="rounded-lg border border-border-default bg-surface-card px-2.5 py-1 text-[11px] font-medium text-content-secondary transition-colors hover:border-[var(--accent-strong)] hover:text-content-primary"
                              >
                                → {roleLabels[targetRole]}
                              </FormSubmitButton>
                            </form>
                          ))
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
