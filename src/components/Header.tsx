import Link from "next/link";

import { signOut } from "@/app/(auth)/actions";
import { appConfig } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight text-zinc-950">
            {appConfig.name}
          </Link>
          <form action="/search" method="get" className="hidden w-full max-w-md sm:block">
            <label htmlFor="q" className="sr-only">
              Search prompts
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Search prompts…"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none ring-zinc-950/10 placeholder:text-zinc-400 focus:ring-4"
            />
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {user ? (
            <Link
              href="/submit"
              aria-label="Create prompt"
              title="Create prompt"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50"
            >
              +
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
            >
              Create account
            </Link>
          )}

          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
