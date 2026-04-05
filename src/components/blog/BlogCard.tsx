"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { getTopicBySlug } from "@/lib/blog/topics";

export function BlogCard({ post }: { post: BlogPost }) {
  const topic = getTopicBySlug(post.topic);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-border-default bg-surface-card overflow-hidden transition-all duration-200 hover:border-content-muted hover:shadow-md"
    >
      {/* Cover image */}
      {post.coverImage ? (
        <div className="aspect-[16/9] bg-surface-secondary overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-accent-500/10 to-accent-600/5 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-content-muted">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
      )}

      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-content-muted mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </time>
          {topic ? (
            <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 font-medium text-content-secondary">
              {topic.name}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-content-primary leading-snug group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
          {post.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-content-secondary line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-content-muted">
          <span>{post.author}</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
