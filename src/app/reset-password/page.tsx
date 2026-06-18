"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/config";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setStatus("error"); setMessage("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setStatus("error"); setMessage("Passwords do not match."); return; }

    setStatus("loading");
    const supabase = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage("Password updated! Redirecting…");
      setTimeout(() => router.push("/"), 1500);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-220px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-content-primary">Set new password</h1>
          <p className="mt-2 text-sm text-content-secondary">Choose a strong password for your account.</p>
        </div>

        <div className="rounded-[28px] border border-border-default bg-surface-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-content-primary">New password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                placeholder="Min. 8 characters"
                className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-content-primary">Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repeat password"
                className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400"
              />
            </label>

            {message ? (
              <p className={`text-sm ${status === "error" ? "text-red-500" : "text-emerald-600"}`}>{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent-600 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? "Saving…" : status === "success" ? "Done!" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
