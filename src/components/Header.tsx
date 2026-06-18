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
    <header className="sticky top-0 z-30 border-b border-border-default bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-[57px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="h-[7px] w-[7px] rounded-[2px] bg-accent-600 dark:bg-accent-400" aria-hidden="true" />
            <span className="text-[15px] font-medium tracking-tight text-content-primary">{appConfig.name}</span>
          </Link>
          <div className="hidden items-center gap-0.5 md:flex">
            <Link href="/videos"   className="rounded-lg px-3 py-1.5 text-sm text-content-muted transition-colors hover:text-content-primary">Videos</Link>
            <Link href="/blog"     className="rounded-lg px-3 py-1.5 text-sm text-content-muted transition-colors hover:text-content-primary">Blog</Link>
            <Link href="/services" className="rounded-lg px-3 py-1.5 text-sm text-content-muted transition-colors hover:text-content-primary">Services</Link>
          </div>
        </div>

        <form action="/search" method="get" className="hidden w-full max-w-sm md:block">
          <label htmlFor="header-search" className="sr-only">Search prompts</label>
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input id="header-search" name="q" type="search" placeholder="Search prompts…"
              className="h-9 w-full rounded-xl border border-border-default bg-surface-secondary pl-9 pr-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-[var(--accent-strong)]"
            />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/submit" className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-surface-card px-3 py-1.5 text-sm font-medium text-content-primary transition-colors hover:border-[var(--accent-strong)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              Submit
            </Link>
          ) : (
            <Link href="/signup" className="hidden sm:inline-flex rounded-xl border border-border-default bg-surface-card px-3 py-1.5 text-sm font-medium text-content-primary transition-colors hover:border-[var(--accent-strong)]">
              Join free
            </Link>
          )}
          {user ? (
            <form action={signOut}>
              <button type="submit" className="rounded-xl bg-accent-600 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">Sign out</button>
            </form>
          ) : (
            <Link href="/login" className="rounded-xl bg-accent-600 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
