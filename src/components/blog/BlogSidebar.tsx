import Link from "next/link";

import { blogTopics } from "@/lib/blog/topics";
import type { BlogPost } from "@/lib/blog/types";

export function BlogSidebar({ recentPosts, currentSlug }: { recentPosts: BlogPost[]; currentSlug?: string }) {
  return (
    <aside className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[28px] border border-border-default/80 bg-surface-card/90 p-4 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)]">
      <Link href="/blog" className="text-sm font-medium text-content-secondary transition-colors hover:text-content-primary">
        ← All posts
      </Link>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-content-muted">Recent</p>
        <ul className="space-y-1">
          {recentPosts.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`block rounded-2xl px-3 py-2 text-[13px] leading-snug transition-colors ${currentSlug === post.slug ? "bg-accent-500/10 font-medium text-accent-600 dark:text-accent-400" : "text-content-secondary hover:bg-surface-secondary hover:text-content-primary"}`}
              >
                {post.title.length > 54 ? `${post.title.slice(0, 54)}...` : post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-content-muted">Topics</p>
        <ul className="space-y-1">
          {blogTopics.map((topic) => (
            <li key={topic.slug}>
              <Link href={`/blog/topic/${topic.slug}`} className="block rounded-2xl px-3 py-2 text-[13px] text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content-primary">
                {topic.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
