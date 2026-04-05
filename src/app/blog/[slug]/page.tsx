import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { BlogImage } from "@/components/blog/BlogImage";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogTOC } from "@/components/blog/BlogTOC";
import { CopyPageButton } from "@/components/blog/CopyPageButton";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { extractHeadings } from "@/lib/blog/headings";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { getTopicBySlug } from "@/lib/blog/topics";
import "@/components/blog/blog.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} - PromptShare Blog`,
    description: post.description,
  };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const headings = extractHeadings(post.content);
  const topic = getTopicBySlug(post.topic);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-0 lg:py-10">
      <div className="mx-auto max-w-[1280px] lg:grid lg:grid-cols-[220px_1fr_220px] lg:gap-10 xl:grid-cols-[240px_1fr_240px] xl:gap-14">
        <div className="hidden lg:block">
          <BlogSidebar recentPosts={allPosts} currentSlug={slug} />
        </div>

        <article className="min-w-0">
          <header className="rounded-[34px] border border-border-default/80 bg-surface-card/94 p-6 text-center shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm text-content-muted">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
              {topic ? <span className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-content-secondary">{topic.name}</span> : null}
            </div>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight tracking-[-0.03em] text-content-primary sm:text-5xl">{post.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-content-secondary">{post.description}</p>
            <div className="mt-5 text-sm text-content-muted">By <span className="font-medium text-content-secondary">{post.author}</span> · {post.readTime} min read</div>
          </header>

          <div className="mt-8 overflow-hidden rounded-[30px] border border-border-default/80 bg-surface-card shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)]">
            <BlogImage src={post.coverImage ?? "/blog/prompt-engineering-101.svg"} alt={post.title} className="w-full" />
          </div>

          <div className="blog-article mx-auto mt-10 max-w-[760px]">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <div className="hidden lg:block">
          <BlogTOC headings={headings} />
        </div>
      </div>

      <CopyPageButton />
    </div>
  );
}
