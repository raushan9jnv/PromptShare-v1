import { VideoCard } from "@/components/VideoCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type VideoRow = {
  id: string;
  youtube_video_id: string;
  title: string;
  description: string | null;
  categories: { name: string } | { name: string }[] | null;
};

function categoryName(categories: VideoRow["categories"]): string | null {
  if (!categories) return null;
  if (Array.isArray(categories)) return categories[0]?.name ?? null;
  return categories.name ?? null;
}

export default async function VideosPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("id, youtube_video_id, title, description, categories ( name )")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const videos = (data ?? []) as unknown as VideoRow[];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <section className="mb-8 rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-content-muted">Videos</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">Watch curated AI tutorials and walkthroughs.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">A growing library of YouTube videos picked by the PromptShare team.</p>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error.message}</div>
        ) : videos.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-border-default bg-surface-card p-12 text-center text-sm text-content-secondary">
            No videos yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                videoId={video.youtube_video_id}
                title={video.title}
                description={video.description}
                categoryName={categoryName(video.categories)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
