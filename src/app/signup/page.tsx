import Link from "next/link";

import { signUpWithPassword } from "@/app/(auth)/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[calc(100dvh-200px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-lg shadow-accent-600/25 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary">Create account</h1>
          <p className="mt-2 text-sm text-content-secondary">Sign up to post prompts and share with the community.</p>
        </div>

        {/* Error banner */}
        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        ) : null}

        {/* Form card */}
        <div className="rounded-2xl border border-border-default bg-surface-card p-6">
          <form action={signUpWithPassword} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-content-primary">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-content-primary">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-content-primary">Confirm password</span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
              />
            </label>

            <FormSubmitButton
              pendingText="Creating account…"
              className="inline-flex w-full items-center justify-center rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-accent-600/25 hover:bg-accent-700 disabled:opacity-60 transition-all"
            >
              Create account
            </FormSubmitButton>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-content-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent-600 dark:text-accent-400 underline underline-offset-4">
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
