import Link from "next/link";
import { redirect } from "next/navigation";

import { createPrompt } from "@/app/submit/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { MultiSelect } from "@/components/MultiSelect";
import { categories, contentTypes, models } from "@/lib/taxonomy";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await searchParams;
  const topicCategories = categories.filter((c) => c.slug !== "trending");

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="hover:text-content-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">Submit</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-content-primary">Submit a prompt</h1>
        <p className="mt-2 text-base text-content-secondary">
          Text is stored in Postgres. Images, video, and audio are uploaded by you to Storage —{" "}
          <span className="font-medium text-content-primary">no AI generation</span> on this site.
        </p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <form
          action={createPrompt}
          encType="multipart/form-data"
          className="mt-8 space-y-5 rounded-2xl border border-border-default bg-surface-card p-6"
        >
          <div className="text-sm text-content-secondary">
            Signed in as <span className="font-medium text-content-primary">{user.email}</span>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-content-primary">Title</span>
            <input
              name="title"
              required
              maxLength={200}
              className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-content-primary">Prompt text</span>
            <textarea
              name="body"
              required
              rows={10}
              className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all font-mono"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-1">
              <span className="text-sm font-medium text-content-primary">Content type</span>
              <select
                name="content_type"
                defaultValue="text"
                className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
              >
                {contentTypes.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="sm:col-span-1">
              <MultiSelect
                name="category_slugs"
                label="Categories"
                required
                options={topicCategories.map((c) => ({ value: c.slug, label: c.name }))}
                placeholder="Select categories…"
              />
            </div>

            <div className="sm:col-span-1">
              <MultiSelect
                name="model_slugs"
                label="Models"
                required
                options={models.map((m) => ({ value: m.slug, label: m.name }))}
                placeholder="Select models…"
              />
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-content-primary">Tags (optional)</span>
            <p className="mt-1 text-xs text-content-muted">Comma-separated, e.g. marketing, hooks, saas</p>
            <input
              name="tags"
              placeholder="marketing, hooks, saas"
              className="mt-2 w-full rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-content-primary">Media (optional)</span>
            <p className="mt-1 text-xs text-content-muted">
              Upload images, a short video, or audio previews. Files upload to your Supabase bucket{" "}
              <code className="rounded bg-surface-secondary px-1.5 py-0.5 text-xs">prompt-images</code>.
            </p>
            <input
              name="files"
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="mt-2 block w-full text-sm text-content-secondary file:mr-3 file:rounded-xl file:border file:border-border-default file:bg-surface-card file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-primary hover:file:bg-surface-secondary file:transition-colors"
            />
          </label>

          <FormSubmitButton
            pendingText="Publishing…"
            className="inline-flex w-full items-center justify-center rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-accent-600/25 hover:bg-accent-700 disabled:opacity-60 transition-all"
          >
            Publish
          </FormSubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-content-secondary">
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-accent-600 dark:text-accent-400 underline underline-offset-4">
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
