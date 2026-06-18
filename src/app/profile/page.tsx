import { redirect } from "next/navigation";

import { ChangePasswordForm } from "@/app/profile/ChangePasswordForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-content-primary">Your profile</h1>

      {/* Account info */}
      <section className="mb-6 rounded-2xl border border-border-default bg-surface-card p-6">
        <h2 className="mb-4 text-sm font-semibold text-content-primary">Account</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-sm font-semibold text-white">
            {(user.email?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-content-primary">{user.email}</div>
            <div className="text-xs text-content-muted">Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section className="mb-6 rounded-2xl border border-border-default bg-surface-card p-6">
        <h2 className="mb-1 text-sm font-semibold text-content-primary">Change password</h2>
        <p className="mb-4 text-xs text-content-muted">Leave blank to keep your current password.</p>
        <ChangePasswordForm />
      </section>

      {/* Saved prompts placeholder */}
      <section className="mb-6 rounded-2xl border border-dashed border-border-default bg-surface-card p-6">
        <h2 className="mb-1 text-sm font-semibold text-content-primary">Saved prompts</h2>
        <p className="text-xs text-content-muted">Bookmarked prompts will appear here. Coming soon.</p>
      </section>

      {/* Liked prompts placeholder */}
      <section className="rounded-2xl border border-dashed border-border-default bg-surface-card p-6">
        <h2 className="mb-1 text-sm font-semibold text-content-primary">Liked prompts</h2>
        <p className="text-xs text-content-muted">Prompts you have liked will appear here. Coming soon.</p>
      </section>
    </div>
  );
}
