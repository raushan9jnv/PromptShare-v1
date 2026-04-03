import Link from "next/link";

import { signInWithPassword } from "@/app/(auth)/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">Welcome back. Sign in to submit prompts.</p>

      {success ? (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <form action={signInWithPassword} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 outline-none ring-zinc-950/10 focus:ring-4"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 outline-none ring-zinc-950/10 focus:ring-4"
          />
        </label>

        <FormSubmitButton
          pendingText="Signing in…"
          className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60"
        >
          Sign in
        </FormSubmitButton>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-zinc-950 underline underline-offset-4">
          Create one
        </Link>
        .
      </p>
    </div>
  );
}

