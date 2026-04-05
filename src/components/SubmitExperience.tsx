"use client";

import { useMemo, useState } from "react";

const fieldSuggestions: Record<string, string[]> = {
  title: ["1980 photo restoration prompt", "Luxury product glow-up prompt", "Viral reel hook pack"],
  body: ["Use placeholders like {{subject}} or {{style}}.", "Mention the visual style, camera feel, and output quality.", "Add constraints so the result is more reusable."],
  tags: ["image transform, cinematic, restoration", "hooks, reels, social", "developer, debugging, prompt guide"],
};

export function SubmitExperience({
  userEmail,
  categories,
  models,
  contentTypes,
}: {
  userEmail: string;
  categories: { slug: string; name: string }[];
  models: { slug: string; name: string }[];
  contentTypes: { slug: string; name: string }[];
}) {
  const [focused, setFocused] = useState<"title" | "body" | "tags" | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [contentType, setContentType] = useState("image");
  const [category, setCategory] = useState(categories[0]?.slug ?? "");
  const [model, setModel] = useState(models[0]?.slug ?? "");

  const previewText = useMemo(() => body.replace(/\s+/g, " ").trim().slice(0, 130) || "Your prompt preview will update here as you type.", [body]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["01", "Basics"],
            ["02", "Media"],
            ["03", "Review"],
          ].map(([step, label]) => (
            <div key={step} className="rounded-full border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-primary">
              {step} {label}
            </div>
          ))}
        </div>

        <div className="space-y-6 rounded-[30px] border border-border-default/80 bg-surface-card p-6 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
          <div className="text-sm text-content-secondary">Signed in as <span className="font-medium text-content-primary">{userEmail}</span></div>

          <section className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-content-primary">Step 1: Prompt basics</div>
              <p className="mt-1 text-sm text-content-secondary">Describe what the prompt does and who it is for.</p>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-content-primary">Title</span>
              <input name="title" required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} onFocus={() => setFocused("title")} onBlur={() => setFocused(null)} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-[#E8883A]" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-content-primary">Prompt text</span>
              <textarea name="body" required rows={10} value={body} onChange={(event) => setBody(event.target.value)} onFocus={() => setFocused("body")} onBlur={() => setFocused(null)} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 font-mono text-sm text-content-primary outline-none focus:border-[#E8883A]" />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Content type</span>
                <select name="content_type" value={contentType} onChange={(event) => setContentType(event.target.value)} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary">
                  {contentTypes.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Category</span>
                <select name="category_slugs" value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary">
                  {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-content-primary">Model</span>
                <select name="model_slugs" value={model} onChange={(event) => setModel(event.target.value)} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary">
                  {models.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-content-primary">Tags</span>
              <input name="tags" value={tags} onChange={(event) => setTags(event.target.value)} onFocus={() => setFocused("tags")} onBlur={() => setFocused(null)} placeholder="image transform, cinematic, social" className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-[#E8883A]" />
            </label>
          </section>

          <section className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-content-primary">Step 2: Media</div>
              <p className="mt-1 text-sm text-content-secondary">Upload images in order so the first can act like input and the second like output.</p>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-content-primary">Before image</span>
              <input name="files" type="file" accept="image/*" className="mt-2 block w-full text-sm text-content-secondary file:mr-3 file:rounded-xl file:border file:border-border-default file:bg-surface-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-content-primary">After image</span>
              <input name="files" type="file" accept="image/*" className="mt-2 block w-full text-sm text-content-secondary file:mr-3 file:rounded-xl file:border file:border-border-default file:bg-surface-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-content-primary">Extra media</span>
              <input name="files" type="file" multiple accept="image/*,video/*,audio/*" className="mt-2 block w-full text-sm text-content-secondary file:mr-3 file:rounded-xl file:border file:border-border-default file:bg-surface-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-content-primary" />
            </label>
          </section>

          <section>
            <div className="text-sm font-semibold text-content-primary">Step 3: Review</div>
            <p className="mt-1 text-sm text-content-secondary">Check the preview card on the right, then publish when it looks ready.</p>
          </section>

          {focused ? (
            <div className="rounded-2xl border border-[#E8883A]/30 bg-[#E8883A]/8 p-4 text-sm text-content-secondary">
              <div className="font-medium text-content-primary">Suggestions</div>
              <div className="mt-2 space-y-2">
                {fieldSuggestions[focused].map((item) => <div key={item}>{item}</div>)}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[30px] border border-border-default/80 bg-surface-card p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
          <div className="text-sm font-semibold text-content-primary">Live card preview</div>
          <div className="mt-4 overflow-hidden rounded-[26px] border border-border-default/80 bg-surface-card shadow-[0_18px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="relative aspect-[16/9] bg-[linear-gradient(135deg,rgba(30,157,139,0.18),rgba(232,136,58,0.24))]">
              <div className="absolute left-4 top-4 flex gap-2">
                <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">{categories.find((item) => item.slug === category)?.name ?? "Category"}</span>
                <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">{contentTypes.find((item) => item.slug === contentType)?.name ?? "Type"}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="text-xl font-semibold tracking-tight text-content-primary">{title || "Your prompt title"}</div>
              <p className="mt-2 text-sm leading-7 text-content-secondary">{previewText}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-xs uppercase tracking-[0.18em] text-content-muted">
                <span>{models.find((item) => item.slug === model)?.name ?? "Model"}</span>
                <span>Open →</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
