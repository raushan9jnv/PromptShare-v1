import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";

import { createCategory, deleteCategory, updateCategory } from "./actions";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  sort_order: number;
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  const categories = (data ?? []) as CategoryRow[];

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-border-default/80 bg-surface-card/94 p-6">
        <h2 className="font-display text-xl text-content-primary">Add category</h2>
        <form action={createCategory} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input name="name" placeholder="Name" required className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <input name="slug" placeholder="Slug (auto if blank)" className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <input name="description" placeholder="Description" className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)] sm:col-span-2" />
          <input name="color" type="color" defaultValue="#E8883A" className="h-10 w-full rounded-2xl border border-border-default bg-surface-secondary px-2" />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={0} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <FormSubmitButton pendingText="Adding..." className="rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">
            Add
          </FormSubmitButton>
        </form>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-[24px] border border-border-default/80 bg-surface-card/94">
        <ul className="divide-y divide-border-subtle">
          {categories.map((category) => (
            <li key={category.id} className="p-5">
              <form action={updateCategory} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-center">
                <input type="hidden" name="id" value={category.id} />
                <input name="name" defaultValue={category.name} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <input name="slug" defaultValue={category.slug} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <input name="description" defaultValue={category.description ?? ""} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <input name="color" type="color" defaultValue={category.color ?? "#E8883A"} className="h-10 w-full rounded-2xl border border-border-default bg-surface-secondary px-2" />
                <input name="sort_order" type="number" defaultValue={category.sort_order} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <div className="flex gap-2">
                  <FormSubmitButton pendingText="Saving..." className="rounded-full border border-border-default bg-surface-secondary px-4 py-2 text-xs font-semibold text-content-primary transition-colors hover:border-[var(--accent-strong)]">
                    Save
                  </FormSubmitButton>
                </div>
              </form>
              <form action={deleteCategory} className="mt-2">
                <input type="hidden" name="id" value={category.id} />
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
