/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogImage } from "@/components/blog/BlogImage";
import { getAllPosts } from "@/lib/blog/posts";
import { blogTopics } from "@/lib/blog/topics";

export const metadata = {
  title: "Blog - PromptShare",
  description: "Prompting guides, creator workflows, software prompting, and AI model tips.",
};

export default function BlogListPage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">PromptShare Journal</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">Guides for creators, builders, and people learning how to prompt better.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">
            This is where we publish prompting guides, model-specific tips, software workflows, and creator-first playbooks that support the product.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/blog" className="rounded-full bg-content-primary px-4 py-2 text-sm font-medium text-surface-primary">All</Link>
          {blogTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/blog/topic/${topic.slug}`}
              className="rounded-full border border-border-default px-4 py-2 text-sm font-medium text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content-primary"
            >
              {topic.name}
            </Link>
          ))}
        </div>

        {featured ? (
          <div className="mt-8">
            <Link href={`/blog/${featured.slug}`} className="group grid gap-6 overflow-hidden rounded-[30px] border border-border-default/80 bg-surface-card shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-accent-300 md:grid-cols-[1.08fr_0.92fr]">
              <div className="overflow-hidden bg-surface-secondary">
                <BlogImage src={featured.coverImage ?? "/blog/prompt-engineering-101.svg"} alt={featured.title} className="h-full min-h-[280px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-content-muted">
                  <time dateTime={featured.date}>{new Date(featured.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                  <span className="rounded-full bg-surface-secondary px-2.5 py-1 font-medium text-content-secondary">
                    {blogTopics.find((topic) => topic.slug === featured.topic)?.name ?? featured.topic}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-content-primary transition-colors group-hover:text-accent-600 dark:group-hover:text-accent-400 sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-content-secondary">{featured.description}</p>
                <div className="mt-5 flex items-center gap-4 text-xs text-content-muted">
                  <span>{featured.author}</span>
                  <span>{featured.readTime} min read</span>
                </div>
              </div>
            </Link>
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}

        {posts.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-12 text-center">
            <h2 className="text-xl font-semibold text-content-primary">Blog coming soon</h2>
            <p className="mt-2 text-sm leading-7 text-content-secondary">We are preparing guides for creator prompting, software workflows, and model-specific strategy.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
