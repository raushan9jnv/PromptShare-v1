import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";

import { createModel, deleteModel, updateModel } from "./actions";

type ModelRow = {
  id: string;
  slug: string;
  name: string;
  href: string | null;
  sort_order: number;
};

export default async function AdminModelsPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("models").select("*").order("sort_order", { ascending: true });
  const models = (data ?? []) as ModelRow[];

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-border-default/80 bg-surface-card/94 p-6">
        <h2 className="font-display text-xl text-content-primary">Add model</h2>
        <form action={createModel} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input name="name" placeholder="Name" required className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <input name="slug" placeholder="Slug (auto if blank)" className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <input name="href" placeholder="https://..." className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)] sm:col-span-2" />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={0} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          <FormSubmitButton pendingText="Adding..." className="rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">
            Add
          </FormSubmitButton>
        </form>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-[24px] border border-border-default/80 bg-surface-card/94">
        <ul className="divide-y divide-border-subtle">
          {models.map((model) => (
            <li key={model.id} className="p-5">
              <form action={updateModel} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-center">
                <input type="hidden" name="id" value={model.id} />
                <input name="name" defaultValue={model.name} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <input name="slug" defaultValue={model.slug} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <input name="href" defaultValue={model.href ?? ""} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)] sm:col-span-2" />
                <input name="sort_order" type="number" defaultValue={model.sort_order} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
                <FormSubmitButton pendingText="Saving..." className="rounded-full border border-border-default bg-surface-secondary px-4 py-2 text-xs font-semibold text-content-primary transition-colors hover:border-[var(--accent-strong)]">
                  Save
                </FormSubmitButton>
              </form>
              <form action={deleteModel} className="mt-2">
                <input type="hidden" name="id" value={model.id} />
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
