import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { updatePrompt } from "@/app/p/[slug]/edit/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { getPromptBySlug } from "@/lib/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { categories, contentTypes, models } from "@/lib/taxonomy";

export default async function EditPromptPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ error?: string }> }) {
  const { slug } = await params;
  const { error } = await searchParams;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.id !== prompt.userId) redirect(`/p/${slug}`);

  const availableCategories = categories.filter((category) => category.slug !== "trending");

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[980px]">
        <nav className="mb-6 flex items-center gap-2 text-sm text-content-muted">
          <Link href={`/p/${slug}`} className="transition-colors hover:text-content-primary">Back to prompt</Link>
        </nav>

        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Edit prompt</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-content-primary">Update your prompt</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-content-secondary">Adjust title, prompt text, categories, models, and tags without changing the original URL.</p>
        </section>

        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

        <form action={updatePrompt} className="mt-8 space-y-6 rounded-[30px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
          <input type="hidden" name="id" value={prompt.id} />
          <input type="hidden" name="slug" value={prompt.slug} />

          <label className="block">
            <span className="text-sm font-medium text-content-primary">Title</span>
            <input name="title" defaultValue={prompt.title} required className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-content-primary">Prompt text</span>
            <textarea name="body" defaultValue={prompt.body} rows={12} required className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 font-mono text-sm text-content-primary outline-none focus:border-accent-400" />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-content-primary">Content type</span>
              <select name="content_type" defaultValue={prompt.contentType} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary">
                {contentTypes.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-content-primary">Tags</span>
              <input name="tags" defaultValue={prompt.tags.join(", ")} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-content-primary">Categories</div>
              <div className="mt-3 grid gap-2">
                {availableCategories.map((category) => (
                  <label key={category.slug} className="flex items-center gap-3 rounded-2xl bg-surface-secondary px-4 py-3 text-sm text-content-secondary">
                    <input type="checkbox" name="category_slugs" value={category.slug} defaultChecked={prompt.categorySlugs.includes(category.slug)} className="accent-accent-600" />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-content-primary">Models</div>
              <div className="mt-3 grid gap-2">
                {models.map((model) => (
                  <label key={model.slug} className="flex items-center gap-3 rounded-2xl bg-surface-secondary px-4 py-3 text-sm text-content-secondary">
                    <input type="checkbox" name="model_slugs" value={model.slug} defaultChecked={prompt.modelSlugs.includes(model.slug)} className="accent-accent-600" />
                    <span>{model.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <FormSubmitButton pendingText="Saving..." className="inline-flex items-center justify-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white hover:bg-accent-700">Save changes</FormSubmitButton>
            <Link href={`/p/${slug}`} className="inline-flex items-center justify-center rounded-full border border-border-default bg-surface-card px-6 py-3 text-sm font-medium text-content-primary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}