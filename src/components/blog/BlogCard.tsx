"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { getTopicBySlug } from "@/lib/blog/topics";
import type { BlogPost } from "@/lib/blog/types";

export function BlogCard({ post }: { post: BlogPost }) {
  const topic = getTopicBySlug(post.topic);

  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-[28px] border border-border-default/80 bg-surface-card shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-1 hover:border-accent-300">
      <div className="aspect-[16/9] overflow-hidden bg-surface-secondary">
        <img
          src={post.coverImage ?? "/blog/prompt-engineering-101.svg"}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(event) => {
            (event.target as HTMLImageElement).src = "/blog/prompt-engineering-101.svg";
          }}
        />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-3 text-xs text-content-muted">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
          {topic ? <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 font-medium text-content-secondary">{topic.name}</span> : null}
        </div>

        <h3 className="text-lg font-semibold leading-snug text-content-primary transition-colors group-hover:text-accent-600 dark:group-hover:text-accent-400">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-content-secondary">{post.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-content-muted">
          <span>{post.author}</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
