import Image from "next/image";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { MultiSelect } from "@/components/MultiSelect";

import { createVideo, deleteVideo, updateVideoStatus } from "./actions";

type VideoRow = {
  id: string;
  youtube_video_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  status: string;
  created_at: string;
};

export default async function AdminVideosPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const [{ data: videos, error }, { data: categories }, { data: tags }] = await Promise.all([
    supabase.from("videos").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("tags").select("id, name").order("name", { ascending: true }),
  ]);

  const videoRows = (videos ?? []) as VideoRow[];
  const categoryOptions = (categories ?? []).map((category) => ({ value: category.id, label: category.name }));
  const tagOptions = (tags ?? []).map((tag) => ({ value: tag.id, label: tag.name }));

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-border-default/80 bg-surface-card/94 p-6">
        <h2 className="font-display text-xl text-content-primary">Add video</h2>
        <form action={createVideo} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="url" placeholder="YouTube URL (watch / youtu.be / embed / shorts)" required className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)] sm:col-span-2" />
            <input name="title" placeholder="Title" required className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
            <select name="category_id" className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]">
              <option value="">No category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <textarea name="description" placeholder="Description" className="rounded-2xl border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)] sm:col-span-2" rows={2} />
          </div>
          <MultiSelect name="tag_ids" label="Tags" options={tagOptions} placeholder="Select tags..." />
          <FormSubmitButton pendingText="Adding..." className="rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">
            Add video (auto-approved)
          </FormSubmitButton>
        </form>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div> : null}

      <div className="overflow-hidden rounded-[24px] border border-border-default/80 bg-surface-card/94">
        <ul className="divide-y divide-border-subtle">
          {videoRows.map((video) => (
            <li key={video.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-secondary">
                  <Image
                    src={`https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-content-primary">{video.title}</div>
                  <div className="mt-1 text-xs capitalize text-content-muted">{video.status} · {new Date(video.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {video.status !== "approved" ? (
                  <form action={updateVideoStatus}>
                    <input type="hidden" name="id" value={video.id} />
                    <input type="hidden" name="status" value="approved" />
                    <FormSubmitButton pendingText="..." className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700">
                      Approve
                    </FormSubmitButton>
                  </form>
                ) : null}
                {video.status !== "rejected" ? (
                  <form action={updateVideoStatus}>
                    <input type="hidden" name="id" value={video.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <FormSubmitButton pendingText="..." className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700">
                      Reject
                    </FormSubmitButton>
                  </form>
                ) : null}
                <form action={deleteVideo}>
                  <input type="hidden" name="id" value={video.id} />
                  <FormSubmitButton pendingText="..." className="rounded-full px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
                    Delete
                  </FormSubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
