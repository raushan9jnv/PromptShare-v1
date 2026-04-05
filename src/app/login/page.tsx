import Link from "next/link";

import { signInWithPassword } from "@/app/(auth)/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { error, success } = await searchParams;

  return (
    <div className="flex min-h-[calc(100dvh-220px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-content-primary">Welcome back</h1>
          <p className="mt-2 text-sm text-content-secondary">Sign in to submit prompts and manage your library.</p>
        </div>
        {success ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}
        {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}
        <div className="rounded-[28px] border border-border-default bg-surface-card p-6">
          <form action={signInWithPassword} className="space-y-4">
            <label className="block"><span className="text-sm font-medium text-content-primary">Email</span><input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400" /></label>
            <label className="block"><span className="text-sm font-medium text-content-primary">Password</span><input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400" /></label>
            <FormSubmitButton pendingText="Signing in..." className="inline-flex w-full items-center justify-center rounded-full bg-accent-600 px-4 py-3 text-sm font-medium text-white">Sign in</FormSubmitButton>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-content-secondary">Don't have an account? <Link href="/signup" className="font-medium text-content-primary underline underline-offset-4">Create one</Link>.</p>
      </div>
    </div>
  );
}
