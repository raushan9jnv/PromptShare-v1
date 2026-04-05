import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { blogTopics } from "@/lib/blog/topics";

export function BlogSidebar({
  recentPosts,
  currentSlug,
}: {
  recentPosts: BlogPost[];
  currentSlug?: string;
}) {
  return (
    <aside className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {/* All posts link */}
      <Link
        href="/blog"
        className="text-sm font-medium text-content-secondary hover:text-content-primary transition-colors"
      >
        ← All posts
      </Link>

      {/* Recent posts */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-3">
          Recent
        </p>
        <ul className="space-y-1">
          {recentPosts.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`
                  block text-[13px] leading-snug py-1.5 px-3 rounded-md transition-colors
                  ${currentSlug === post.slug
                    ? "bg-accent-500/10 text-accent-600 dark:text-accent-400 font-medium"
                    : "text-content-secondary hover:bg-surface-secondary hover:text-content-primary"
                  }
                `}
              >
                {post.title.length > 50 ? post.title.slice(0, 50) + "…" : post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Topics */}
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-3">
          Topics
        </p>
        <ul className="space-y-1">
          {blogTopics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/blog/topic/${topic.slug}`}
                className="block text-[13px] text-content-secondary hover:text-content-primary hover:bg-surface-secondary py-1.5 px-3 rounded-md transition-colors"
              >
                {topic.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
