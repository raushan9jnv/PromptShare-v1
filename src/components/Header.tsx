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
    <header className="sticky top-0 z-30 border-b border-border-default/80 bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-content-primary">
            {appConfig.name}
          </Link>

          <form action="/search" method="get" className="hidden w-full max-w-xl md:block">
            <label htmlFor="header-search" className="sr-only">Search prompts</label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                id="header-search"
                name="q"
                type="search"
                placeholder="Search prompts, packs, transformations..."
                className="w-full rounded-full border border-border-default bg-surface-secondary py-2.5 pl-11 pr-4 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-[var(--accent-strong)]"
              />
            </div>
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          {user ? (
            <Link href="/submit" aria-label="Create prompt" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-content-primary transition-all hover:-translate-y-0.5 hover:border-[var(--accent-strong)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Link>
          ) : (
            <Link href="/signup" className="hidden sm:inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary transition-all hover:-translate-y-0.5">
              Join free
            </Link>
          )}

          {user ? (
            <form action={signOut}>
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-accent-700">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-accent-700">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
