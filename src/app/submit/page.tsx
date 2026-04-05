import Link from "next/link";
import { redirect } from "next/navigation";

import { createPrompt } from "@/app/submit/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { MultiSelect } from "@/components/MultiSelect";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { categories, contentTypes, models } from "@/lib/taxonomy";

const featuredExamples = [
  "Restore an old 1980 portrait into a cinematic premium photo",
  "Turn one product shot into a luxury ad visual",
  "Generate 15 reel hooks from one boring topic",
  "Create a YouTube thumbnail angle pack for a new video",
];

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
  const topicCategories = categories.filter((category) => category.slug !== "trending");

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <nav className="mb-6 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-primary">Home</Link>
          <span>/</span>
          <span className="text-content-secondary">Submit</span>
        </nav>

        <section className="rounded-[36px] border border-border-default/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,248,241,0.92))] p-6 shadow-[0_28px_90px_-52px_rgba(145,73,24,0.45)] dark:bg-[linear-gradient(135deg,rgba(31,26,24,0.98),rgba(21,18,17,0.96))] lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Creator upload studio</div>
              <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-content-primary sm:text-5xl">Build a prompt page that already feels useful.</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-content-secondary">
                This flow is meant for prompts with visible payoff. Show the input, show the output, explain the prompt, and help the next creator understand why it works.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Prompt basics", "Title, body, use case, and category fit."],
                  ["Media story", "Upload source, output, references, or a cover preview."],
                  ["Creator context", "Tell people what kind of result this prompt is best for."],
                  ["Publish", "Turn your working prompt into something reusable for others."],
                ].map(([title, body], index) => (
                  <div key={title} className="rounded-[24px] border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-600 text-sm font-semibold text-white">0{index + 1}</div>
                    <h2 className="mt-4 text-lg font-semibold text-content-primary">{title}</h2>
                    <p className="mt-2 text-sm leading-7 text-content-secondary">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-border-default/80 bg-surface-card/92 p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.22)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">What strong prompts look like</div>
              <div className="mt-4 space-y-3">
                {featuredExamples.map((example) => (
                  <div key={example} className="rounded-2xl bg-surface-secondary px-4 py-3 text-sm text-content-primary">{example}</div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[linear-gradient(135deg,rgba(242,90,44,0.08),rgba(255,176,102,0.08))] px-4 py-4 text-sm leading-7 text-content-secondary">
                Signed in as <span className="font-medium text-content-primary">{user.email}</span>. Media is uploaded by you. The site does not generate images for you.
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <form action={createPrompt} encType="multipart/form-data" className="mt-8 space-y-6">
          <section className="rounded-[30px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">01. Prompt basics</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-content-primary">Start with the reusable core.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Title</span>
                <input name="title" required maxLength={200} placeholder="Turn this old 1980 photo into a cinematic restored portrait" className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Prompt type</span>
                <select name="content_type" defaultValue="image" className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all">
                  {contentTypes.map((type) => (
                    <option key={type.slug} value={type.slug}>{type.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-content-primary">Prompt text</span>
              <textarea name="body" required rows={12} placeholder="Explain the exact transformation, visual direction, tone, and constraints..." className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 font-mono text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all" />
            </label>
          </section>

          <section className="rounded-[30px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">02. Use case and fit</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-content-primary">Help people discover it in the right lane.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <MultiSelect
                  name="category_slugs"
                  label="Categories"
                  required
                  options={topicCategories.map((category) => ({ value: category.slug, label: category.name }))}
                  placeholder="Select categories..."
                />
              </div>
              <div>
                <MultiSelect
                  name="model_slugs"
                  label="Models"
                  required
                  options={models.map((model) => ({ value: model.slug, label: model.name }))}
                  placeholder="Select models..."
                />
              </div>
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Audience hint</span>
                <select className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all">
                  <option>Creators and visual makers</option>
                  <option>Social media marketers</option>
                  <option>Software engineers</option>
                  <option>Students / UPSC</option>
                </select>
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-content-primary">Tags</span>
              <p className="mt-1 text-xs text-content-muted">Comma-separated. Example: restoration, cinematic, portrait</p>
              <input name="tags" placeholder="restoration, cinematic, portrait" className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all" />
            </label>
          </section>

          <section className="rounded-[30px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">03. Media story</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-content-primary">Upload what people need to trust the result.</h2>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-content-primary">Media upload</span>
              <p className="mt-1 text-xs text-content-muted">You can upload images, video, or audio previews. For creator prompts, input + output images are the strongest pattern.</p>
              <input name="files" type="file" multiple accept="image/*,video/*,audio/*" className="mt-3 block w-full text-sm text-content-secondary file:mr-3 file:rounded-2xl file:border file:border-border-default file:bg-surface-card file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-primary hover:file:bg-surface-secondary file:transition-colors" />
            </label>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Input image", "What the creator starts with"],
                ["Output image", "The strongest result preview"],
                ["Reference image", "Extra inspiration or style cue"],
                ["Cover preview", "Card thumbnail if needed"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-4">
                  <div className="text-sm font-medium text-content-primary">{title}</div>
                  <div className="mt-1 text-xs leading-6 text-content-muted">{body}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">04. Review and publish</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-content-primary">Make it clear, reusable, and worth opening.</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-surface-secondary px-4 py-4 text-sm leading-7 text-content-secondary">Aim for obvious value in the title so people know what transformation or result they are getting.</div>
              <div className="rounded-2xl bg-surface-secondary px-4 py-4 text-sm leading-7 text-content-secondary">If you have both source and result visuals, upload both. It makes the prompt page feel dramatically stronger.</div>
              <div className="rounded-2xl bg-surface-secondary px-4 py-4 text-sm leading-7 text-content-secondary">This version is still free-first. Premium organization and saved collections will come later.</div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <FormSubmitButton pendingText="Publishing..." className="inline-flex items-center justify-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-accent-600/25 transition-all hover:-translate-y-0.5 hover:bg-accent-700 disabled:opacity-60">
                Publish prompt
              </FormSubmitButton>
              <Link href="/c/image-transform" className="text-sm font-medium text-content-secondary underline underline-offset-4">
                See example creator prompts
              </Link>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
