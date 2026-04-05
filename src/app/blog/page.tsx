import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import { blogTopics } from "@/lib/blog/topics";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogImage } from "@/components/blog/BlogImage";

export const metadata = {
  title: "Blog — PromptShare",
  description: "Tips, guides, and insights on prompt engineering and using AI models effectively.",
};

export default function BlogListPage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-content-primary">
            Blog
          </h1>
          <p className="mt-2 text-base text-content-secondary">
            Tips, guides, and insights on prompt engineering.
          </p>
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className="rounded-full bg-content-primary text-surface-primary px-4 py-1.5 text-sm font-medium transition-colors"
          >
            All
          </Link>
          {blogTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/topic/${t.slug}`}
              className="rounded-full border border-border-default px-4 py-1.5 text-sm font-medium text-content-secondary hover:bg-surface-secondary transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>

        {/* Featured post */}
        {featured ? (
          <div className="mb-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-6 rounded-xl border border-border-default bg-surface-card overflow-hidden transition-all duration-200 hover:border-content-muted hover:shadow-md"
            >
              {/* Cover */}
              <div className="aspect-[16/9] md:aspect-auto bg-surface-secondary overflow-hidden">
                {featured.coverImage ? (
                  <BlogImage
                    src={featured.coverImage}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-accent-500/10 to-accent-600/5 flex items-center justify-center min-h-[200px]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-content-muted">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-content-muted mb-3">
                  <time dateTime={featured.date}>
                    {new Date(featured.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                  <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 font-medium text-content-secondary">
                    {blogTopics.find(t => t.slug === featured.topic)?.name ?? featured.topic}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-content-primary leading-snug group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm text-content-secondary leading-relaxed line-clamp-3">
                  {featured.description}
                </p>
                <div className="mt-4 text-xs text-content-muted flex items-center gap-4">
                  <span>{featured.author}</span>
                  <span>{featured.readTime} min read</span>
                </div>
              </div>
            </Link>
          </div>
        ) : null}

        {/* Grid of remaining posts */}
        {rest.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}

        {/* Empty state */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border-default bg-surface-card p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-content-primary">Coming Soon</h2>
            <p className="mt-2 text-sm text-content-secondary max-w-md mx-auto">
              We&apos;re working on articles about prompt engineering, AI model comparisons,
              and creative workflows. Stay tuned!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
