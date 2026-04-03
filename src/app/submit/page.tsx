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
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Submit a prompt</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Text is stored in Postgres. Images, video, and audio are uploaded by you to Storage —{" "}
        <span className="font-medium text-zinc-800">no AI generation</span> on this site.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <form
        action={createPrompt}
        encType="multipart/form-data"
        className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
      >
        <div className="text-sm text-zinc-600">
          Signed in as <span className="font-medium text-zinc-900">{user.email}</span>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Title</span>
          <input
            name="title"
            required
            maxLength={200}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none ring-zinc-950/10 focus:ring-4"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Prompt text</span>
          <textarea
            name="body"
            required
            rows={10}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none ring-zinc-950/10 focus:ring-4"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block sm:col-span-1">
            <span className="text-sm font-medium text-zinc-800">Content type</span>
            <select
              name="content_type"
              defaultValue="text"
              className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950"
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
          <span className="text-sm font-medium text-zinc-800">Tags (optional)</span>
          <p className="mt-1 text-xs text-zinc-500">Comma-separated, e.g. marketing, hooks, saas</p>
          <input
            name="tags"
            placeholder="marketing, hooks, saas"
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none ring-zinc-950/10 focus:ring-4"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Media (optional)</span>
          <p className="mt-1 text-xs text-zinc-500">
            Upload images, a short video, or audio previews. Files upload to your Supabase bucket{" "}
            <code className="rounded bg-zinc-100 px-1">prompt-images</code>.
          </p>
          <input
            name="files"
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            className="mt-2 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border file:border-zinc-200 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-950 hover:file:bg-zinc-50"
          />
        </label>

        <FormSubmitButton
          pendingText="Publishing…"
          className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60"
        >
          Publish
        </FormSubmitButton>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        Need an account?{" "}
        <Link href="/signup" className="font-medium text-zinc-950 underline underline-offset-4">
          Sign up
        </Link>
        .
      </p>
    </div>
  );
}
