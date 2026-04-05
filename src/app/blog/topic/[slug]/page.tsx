import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostsByTopic } from "@/lib/blog/posts";
import { blogTopics, getTopicBySlug } from "@/lib/blog/topics";
import { BlogCard } from "@/components/blog/BlogCard";

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Topic Not Found" };
  return {
    title: `${topic.name} — PromptShare Blog`,
    description: topic.description,
  };
}

/* ─── Static generation ─── */
export function generateStaticParams() {
  return blogTopics.map((t) => ({ slug: t.slug }));
}

/* ─── Page ─── */
export default async function BlogTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const posts = getPostsByTopic(slug);

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/blog" className="hover:text-content-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-content-secondary">{topic.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-content-primary">
            {topic.name}
          </h1>
          <p className="mt-2 text-base text-content-secondary">
            {topic.description}
          </p>
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className="rounded-full border border-border-default px-4 py-1.5 text-sm font-medium text-content-secondary hover:bg-surface-secondary transition-colors"
          >
            All
          </Link>
          {blogTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/topic/${t.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                t.slug === slug
                  ? "bg-content-primary text-surface-primary"
                  : "border border-border-default text-content-secondary hover:bg-surface-secondary"
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border-default bg-surface-card p-12 text-center">
            <p className="text-sm text-content-secondary">
              No articles in this topic yet.{" "}
              <Link href="/blog" className="font-medium text-content-primary underline underline-offset-4">
                Browse all posts
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
