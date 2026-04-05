import Link from "next/link";

import { signOut } from "@/app/(auth)/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { appConfig } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="sticky top-0 z-30 border-b border-border-default/80 bg-[var(--header-bg)] backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-strong),var(--brand-warm))] text-white shadow-lg shadow-[color:var(--brand-shadow)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">
                Creator Vault
              </div>
              <span className="block truncate text-base font-bold tracking-tight text-content-primary">
                {appConfig.name}
              </span>
            </div>
          </Link>

          <form action="/search" method="get" className="hidden w-full max-w-xl lg:block">
            <label htmlFor="q" className="sr-only">
              Search prompts
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Search prompts…"
                className="w-full rounded-xl border border-border-default bg-surface-secondary py-2 pl-10 pr-4 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all duration-200"
              />
            </div>
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          {user ? (
            <Link
              href="/submit"
              aria-label="Create prompt"
              title="Create prompt"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border-default bg-surface-card text-content-primary hover:-translate-y-0.5 hover:border-accent-400 hover:bg-surface-secondary transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary hover:-translate-y-0.5 hover:bg-surface-secondary transition-all duration-200"
            >
              Share a prompt
            </Link>
          )}

          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/25 hover:-translate-y-0.5 hover:bg-accent-700 transition-all duration-200"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/25 hover:-translate-y-0.5 hover:bg-accent-700 transition-all duration-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
