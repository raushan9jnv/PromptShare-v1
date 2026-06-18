"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/config";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !password) return;
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("loading");
    const supabase = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // Re-authenticate with current password first (Supabase "Require current password" is ON)
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email;
    if (!email) {
      setStatus("error");
      setMessage("Could not verify your session. Please sign in again.");
      return;
    }
    const { error: reAuthError } = await supabase.auth.signInWithPassword({ email, password: current });
    if (reAuthError) {
      setStatus("error");
      setMessage("Current password is incorrect.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage("Password updated successfully.");
      setCurrent("");
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-content-muted">Current password</label>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Your current password"
          className="h-9 w-full rounded-xl border border-border-default bg-surface-secondary px-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-[var(--accent-strong)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-content-muted">New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          placeholder="Min. 8 characters"
          className="h-9 w-full rounded-xl border border-border-default bg-surface-secondary px-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-[var(--accent-strong)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-content-muted">Confirm new password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat new password"
          className="h-9 w-full rounded-xl border border-border-default bg-surface-secondary px-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-[var(--accent-strong)]"
        />
      </div>
      {message ? (
        <p className={`text-xs ${status === "error" ? "text-red-500" : "text-emerald-600"}`}>{message}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading" || !current || !password}
        className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
