import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { getTopicBySlug } from "@/lib/blog/topics";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogTOC, extractHeadings } from "@/components/blog/BlogTOC";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { CopyPageButton } from "@/components/blog/CopyPageButton";
import { BlogImage } from "@/components/blog/BlogImage";
import "@/components/blog/blog.css";

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — PromptShare Blog`,
    description: post.description,
  };
}

/* ─── Static generation ─── */
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

/* ─── Page ─── */
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const headings = extractHeadings(post.content);
  const topic = getTopicBySlug(post.topic);

  return (
    <div className="relative px-6 lg:px-0">
      <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[200px_1fr_200px] lg:gap-10 xl:grid-cols-[220px_1fr_220px] xl:gap-14">
        {/* ─── Left Sidebar ─── */}
        <div className="hidden lg:block py-10">
          <BlogSidebar recentPosts={allPosts} currentSlug={slug} />
        </div>

        {/* ─── Article ─── */}
        <article className="py-10 min-w-0">
          {/* Header */}
          <header className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 text-sm text-content-muted mb-4">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </time>
              {topic ? (
                <span className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-content-secondary">
                  {topic.name}
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-content-primary leading-tight max-w-2xl mx-auto">
              {post.title}
            </h1>

            <p className="mt-4 text-base text-content-secondary max-w-xl mx-auto leading-relaxed">
              {post.description}
            </p>

            <div className="mt-6 text-sm text-content-muted">
              <span className="font-medium text-content-secondary">Authors: </span>
              {post.author}
            </div>
          </header>

          {/* Hero image */}
          {post.coverImage ? (
            <div className="rounded-xl overflow-hidden mb-12 border border-border-default">
              <BlogImage
                src={post.coverImage}
                alt={post.title}
                className="w-full"
              />
            </div>
          ) : null}

          {/* MDX Content */}
          <div className="blog-article max-w-[720px] mx-auto">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Footer divider */}
          <div className="max-w-[720px] mx-auto mt-16 pt-8 border-t border-border-subtle">
            <p className="text-sm text-content-muted text-center">
              Thanks for reading. Found this helpful?{" "}
              <a href="/blog" className="text-content-primary underline underline-offset-4 hover:text-accent-600">
                Browse more articles
              </a>
            </p>
          </div>
        </article>

        {/* ─── Right TOC ─── */}
        <div className="hidden lg:block py-10">
          <BlogTOC headings={headings} />
        </div>
      </div>

      <CopyPageButton />
    </div>
  );
}
