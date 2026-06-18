import Link from "next/link";
import { redirect } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { getLikedPromptsByUser, listPromptsByUserId } from "@/lib/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ChangePasswordForm } from "./ChangePasswordForm";

type Tab = "prompts" | "liked" | "settings";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab: tabParam } = await searchParams;
  const tab: Tab = tabParam === "liked" ? "liked" : tabParam === "settings" ? "settings" : "prompts";

  const tabs: { id: Tab; label: string }[] = [
    { id: "prompts", label: "My prompts" },
    { id: "liked", label: "Liked" },
    { id: "settings", label: "Settings" },
  ];

  let myPrompts = await listPromptsByUserId(user.id).catch(() => []);
  let likedPrompts = tab === "liked" ? await getLikedPromptsByUser(user.id).catch(() => []) : [];

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-600 text-xl font-bold text-white">
          {(user.email?.[0] ?? "?").toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-semibold text-content-primary">{user.email}</div>
          <div className="text-sm text-content-muted">Member since {joinedDate}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-0 border-b border-border-default">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/profile?tab=${t.id}`}
            className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-accent-600 text-content-primary dark:border-accent-400"
                : "border-transparent text-content-muted hover:text-content-secondary"
            }`}
          >
            {t.label}
            {t.id === "prompts" && myPrompts.length > 0 ? (
              <span className="ml-1.5 rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px] text-content-muted">{myPrompts.length}</span>
            ) : null}
            {t.id === "liked" && tab === "liked" && likedPrompts.length > 0 ? (
              <span className="ml-1.5 rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px] text-content-muted">{likedPrompts.length}</span>
            ) : null}
          </Link>
        ))}
      </div>

      {/* My Prompts */}
      {tab === "prompts" ? (
        myPrompts.length > 0 ? (
          <div className="grid gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-4">
            {myPrompts.map((p) => (
              <div key={p.id} className="bg-surface-primary">
                <PromptCard prompt={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default bg-surface-card py-16 text-center text-sm text-content-muted">
            You haven&apos;t submitted any prompts yet.
          </div>
        )
      ) : null}

      {/* Liked Prompts */}
      {tab === "liked" ? (
        likedPrompts.length > 0 ? (
          <div className="grid gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-4">
            {likedPrompts.map((p) => (
              <div key={p.id} className="bg-surface-primary">
                <PromptCard prompt={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default bg-surface-card py-16 text-center text-sm text-content-muted">
            No liked prompts yet. Hit the ♥ on any prompt to save it here.
          </div>
        )
      ) : null}

      {/* Settings */}
      {tab === "settings" ? (
        <div className="max-w-md space-y-6">
          <div className="rounded-2xl border border-border-default bg-surface-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-content-primary">Account</h2>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs text-content-muted">Email</div>
                <div className="text-sm text-content-primary">{user.email}</div>
              </div>
              <div>
                <div className="mb-1 text-xs text-content-muted">User ID</div>
                <div className="font-mono text-xs text-content-muted">{user.id}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border-default bg-surface-card p-6">
            <h2 className="mb-1 text-sm font-semibold text-content-primary">Change password</h2>
            <p className="mb-4 text-xs text-content-muted">Must be at least 8 characters.</p>
            <ChangePasswordForm />
          </div>
        </div>
      ) : null}
    </div>
  );
}
