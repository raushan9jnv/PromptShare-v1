import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";

import { createTag, deleteTag, updateTag } from "./actions";

type TagRow = { id: string; slug: string; name: string };

export default async function AdminTagsPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("tags").select("*").order("name", { ascending: true });
  const tags = (data ?? []) as TagRow[];

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-border-default/80 bg-surface-card/94 p-6">
        <h2 className="font-display text-xl text-content-primary">Add tag</h2>
        <form action={createTag} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input name="name" placeholder="Name" required className="flex-1 rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <input name="slug" placeholder="Slug (auto if blank)" className="flex-1 rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <FormSubmitButton pendingText="Adding..." className="rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">
            Add
          </FormSubmitButton>
        </form>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-[24px] border border-border-default/80 bg-surface-card/94">
        <ul className="divide-y divide-border-subtle">
          {tags.map((tag) => (
            <li key={tag.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <form action={updateTag} className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <input type="hidden" name="id" value={tag.id} />
                <input name="name" defaultValue={tag.name} className="flex-1 rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <input name="slug" defaultValue={tag.slug} className="flex-1 rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <FormSubmitButton pendingText="Saving..." className="rounded-full border border-border-default bg-surface-secondary px-4 py-2 text-xs font-semibold text-content-primary transition-colors hover:border-[var(--accent-strong)]">
                  Save
                </FormSubmitButton>
              </form>
              <form action={deleteTag}>
                <input type="hidden" name="id" value={tag.id} />
                <FormSubmitButton pendingText="Deleting..." className="rounded-full px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
                  Delete
                </FormSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
