import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { BlogPost } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);

    return {
      slug: file.replace(/\.mdx$/, ""),
      title: (data.title as string) ?? "Untitled",
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
      author: (data.author as string) ?? "PromptShare Team",
      topic: (data.topic as string) ?? "prompt-engineering",
      coverImage: (data.coverImage as string) ?? undefined,
      readTime: estimateReadTime(content),
      content,
    } satisfies BlogPost;
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title as string) ?? "Untitled",
    description: (data.description as string) ?? "",
    date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
    author: (data.author as string) ?? "PromptShare Team",
    topic: (data.topic as string) ?? "prompt-engineering",
    coverImage: (data.coverImage as string) ?? undefined,
    readTime: estimateReadTime(content),
    content,
  };
}

export function getPostsByTopic(topicSlug: string): BlogPost[] {
  return getAllPosts().filter((post) => post.topic === topicSlug);
}
