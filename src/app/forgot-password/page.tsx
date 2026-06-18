import Link from "next/link";

import { requestPasswordReset } from "@/app/(auth)/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="flex min-h-[calc(100dvh-220px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-content-primary">Forgot password?</h1>
          <p className="mt-2 text-sm text-content-secondary">Enter your email and we'll send you a reset link.</p>
        </div>

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <div className="font-medium">Email sent!</div>
            <div className="mt-1 text-emerald-700 dark:text-emerald-400">{success}</div>
          </div>
        ) : null}
        {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

        {!success ? (
          <div className="rounded-[28px] border border-border-default bg-surface-card p-6">
            <form action={requestPasswordReset} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Email address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400"
                />
              </label>
              <FormSubmitButton
                pendingText="Sending..."
                className="inline-flex w-full items-center justify-center rounded-full bg-accent-600 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Send reset link
              </FormSubmitButton>
            </form>
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-content-secondary">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-content-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
