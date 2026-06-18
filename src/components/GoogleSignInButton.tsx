"use client";

import { useState } from "react";

import { appConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.41 3.62v3.01h3.86c2.26-2.08 3.57-5.15 3.57-8.66z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.86-3.01c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a11.98 11.98 0 0 0 0 10.76l4-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function GoogleSignInButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appConfig.siteUrl}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // On success the browser is redirected to Google, so no further action needed here.
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "inline-flex w-full items-center justify-center gap-3 rounded-full border border-border-default bg-surface-card px-4 py-3 text-sm font-medium text-content-primary transition-all hover:-translate-y-0.5 hover:border-[var(--accent-strong)] disabled:opacity-60"
        }
      >
        <GoogleIcon />
        {loading ? "Redirecting..." : "Continue with Google"}
      </button>
      {error ? <p className="mt-2 text-center text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
