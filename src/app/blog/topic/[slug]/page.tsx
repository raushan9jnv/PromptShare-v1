import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/BlogCard";
import { getPostsByTopic } from "@/lib/blog/posts";
import { blogTopics, getTopicBySlug } from "@/lib/blog/topics";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Topic Not Found" };

  return {
    title: `${topic.name} - PromptShare Blog`,
    description: topic.description,
  };
}

export function generateStaticParams() {
  return blogTopics.map((topic) => ({ slug: topic.slug }));
}

export default async function BlogTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const posts = getPostsByTopic(slug);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <nav className="mb-6 flex items-center gap-2 text-sm text-content-muted">
          <Link href="/blog" className="transition-colors hover:text-content-primary">Blog</Link>
          <span>/</span>
          <span className="text-content-secondary">{topic.name}</span>
        </nav>

        <section className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Topic</div>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] text-content-primary sm:text-5xl">{topic.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-content-secondary">{topic.description}</p>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/blog" className="rounded-full border border-border-default px-4 py-2 text-sm font-medium text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content-primary">All</Link>
          {blogTopics.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/topic/${item.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${item.slug === slug ? "bg-content-primary text-surface-primary" : "border border-border-default text-content-secondary hover:bg-surface-secondary hover:text-content-primary"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-border-default bg-surface-card p-12 text-center text-sm text-content-secondary">
            No articles in this topic yet. <Link href="/blog" className="font-medium text-content-primary underline underline-offset-4">Browse all posts</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
