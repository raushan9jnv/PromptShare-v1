import Link from "next/link";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogImage } from "@/components/blog/BlogImage";
import { getAllPosts } from "@/lib/blog/posts";
import { blogTopics } from "@/lib/blog/topics";

export const metadata = {
  title: "Blog — PromptShare",
  description: "Tips, guides, and insights on prompt engineering and using AI models effectively.",
};

export default function BlogListPage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">

      {/* Page header */}
      <div className="mb-8 border-b border-border-default pb-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-content-muted">PromptShare</p>
        <h1 className="text-3xl font-semibold tracking-tight text-content-primary">Blog</h1>
        <p className="mt-2 max-w-lg text-sm text-content-secondary">
          Prompt engineering guides, AI model tips, and creative workflows — written for creators.
        </p>

        {/* Topic filter */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="rounded-full bg-content-primary px-3.5 py-1.5 text-xs font-medium text-surface-primary transition-colors"
          >
            All
          </Link>
          {blogTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/topic/${t.slug}`}
              className="rounded-full border border-border-default px-3.5 py-1.5 text-xs font-medium text-content-secondary transition-colors hover:border-[var(--accent-strong)] hover:text-content-primary"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured post */}
      {featured ? (
        <div className="mb-10">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-border-default bg-surface-card transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[1fr_420px]"
          >
            <div className="order-2 flex flex-col justify-center p-6 md:order-1 md:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-[11px] font-semibold text-accent-700 dark:bg-accent-800 dark:text-accent-200">
                  Featured
                </span>
                <span className="text-xs text-content-muted">
                  {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-xs text-content-muted">· {featured.readTime} min read</span>
              </div>
              <h2 className="text-2xl font-semibold leading-snug tracking-tight text-content-primary transition-colors group-hover:text-[var(--accent-strong)]">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-content-secondary line-clamp-3">
                {featured.description}
              </p>
              <div className="mt-4 text-xs text-content-muted">{featured.author}</div>
            </div>
            <div className="order-1 aspect-[16/9] overflow-hidden bg-surface-secondary md:order-2 md:aspect-auto">
              {featured.coverImage ? (
                <BlogImage
                  src={featured.coverImage}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-br from-accent-100 to-accent-50 dark:from-accent-800/30 dark:to-accent-900/10">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-accent-400">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
              )}
            </div>
          </Link>
        </div>
      ) : null}

      {/* Grid */}
      {rest.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      ) : null}

      {/* Empty state */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default bg-surface-card py-20 text-center">
          <div className="mb-3 text-4xl">✍️</div>
          <h2 className="text-lg font-semibold text-content-primary">Coming soon</h2>
          <p className="mt-2 mx-auto max-w-sm text-sm text-content-secondary">
            We're writing guides on prompt engineering, AI model comparisons, and creative workflows.
          </p>
        </div>
      ) : null}
    </div>
  );
}
