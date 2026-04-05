/* ─── Blog data types ─── */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;           // ISO date string e.g. "2026-04-01"
  author: string;
  topic: string;          // slug of the topic
  coverImage?: string;    // path relative to public/
  readTime: number;       // minutes
  content: string;        // raw MDX string
}

export interface BlogTopic {
  slug: string;
  name: string;
  description: string;
}
