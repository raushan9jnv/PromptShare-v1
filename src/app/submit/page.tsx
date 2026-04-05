import { redirect } from "next/navigation";

import { createPrompt } from "@/app/submit/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { SubmitExperience } from "@/components/SubmitExperience";
import { categories, contentTypes, models } from "@/lib/taxonomy";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await searchParams;
  const topicCategories = categories.filter((category) => category.slug !== "trending");

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <section className="mb-8 rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Submit</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">Publish a prompt that feels ready to trust.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">Create a cleaner submission with basics, before-after media, and a preview card before you publish.</p>
        </section>

        {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

        <form action={createPrompt} encType="multipart/form-data">
          <SubmitExperience
            userEmail={user.email ?? ""}
            categories={topicCategories.map((category) => ({ slug: category.slug, name: category.name }))}
            models={models.map((model) => ({ slug: model.slug, name: model.name }))}
            contentTypes={contentTypes.map((type) => ({ slug: type.slug, name: type.name }))}
          />

          <div className="mt-8 flex justify-end">
            <FormSubmitButton pendingText="Publishing..." className="inline-flex items-center justify-center rounded-full bg-[#E8883A] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#d97828] disabled:opacity-60">
              Publish prompt
            </FormSubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
