export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Model = {
  slug: string;
  name: string;
  href: string;
};

/** What the prompt output is for (image/video/text/music/audio). */
export type ContentTypeSlug = "image" | "video" | "text" | "music" | "audio";

export type ContentTypeInfo = {
  slug: ContentTypeSlug;
  name: string;
  description: string;
};

export const contentTypes: ContentTypeInfo[] = [
  { slug: "text", name: "Text", description: "Chat / writing / code prompts." },
  { slug: "image", name: "Image", description: "Prompts for image tools (you upload previews)." },
  { slug: "video", name: "Video", description: "Scripts, shot lists, editing prompts." },
  { slug: "music", name: "Music", description: "Composition, lyrics, style prompts." },
  { slug: "audio", name: "Audio", description: "Voice, podcast, sound design prompts." },
];

export const categories: Category[] = [
  { slug: "trending", name: "Trending", description: "What’s working right now." },

  { slug: "social-media", name: "Social Media", description: "Hooks, captions, carousels, short-form scripts." },
  { slug: "youtube", name: "YouTube", description: "Titles, scripts, thumbnails, retention hooks." },
  { slug: "tiktok", name: "TikTok", description: "Short scripts, hooks, trends, CTA." },
  { slug: "instagram", name: "Instagram", description: "Reels, captions, carousel copy, comments." },
  { slug: "linkedin", name: "LinkedIn", description: "Posts, thought leadership, outreach messages." },

  { slug: "marketing", name: "Marketing", description: "Ads, landing pages, positioning, copy." },
  { slug: "seo", name: "SEO", description: "Keywords, briefs, outlines, meta descriptions." },
  { slug: "email-marketing", name: "Email Marketing", description: "Cold email, newsletters, drip sequences." },

  { slug: "business", name: "Business", description: "Ideas, research, proposals, operations." },
  { slug: "sales", name: "Sales", description: "Discovery, objection handling, scripts." },

  { slug: "software", name: "Software / Dev", description: "Debugging, code review, system design." },
  { slug: "sql", name: "SQL", description: "Query help, optimization, schema design." },
  { slug: "product", name: "Product", description: "PRDs, user stories, roadmaps." },

  { slug: "education", name: "Education", description: "Study plans, quizzes, explanations." },
  { slug: "productivity", name: "Productivity", description: "Summaries, rewrites, templates." },

  { slug: "design", name: "Design", description: "UX writing, UI copy, brand voice." },
  { slug: "image-prompts", name: "Image Prompts", description: "Ready-to-use prompts for image models." },
];

export const models: Model[] = [
  { slug: "gemini", name: "Gemini", href: "https://gemini.google.com/app" },
  { slug: "chatgpt", name: "ChatGPT", href: "https://chat.openai.com/" },
  { slug: "claude", name: "Claude", href: "https://claude.ai/" },
  { slug: "copilot", name: "Copilot", href: "https://github.com/features/copilot" },
  { slug: "midjourney", name: "Midjourney", href: "https://www.midjourney.com/" },
  { slug: "dalle", name: "DALL·E", href: "https://labs.openai.com/" },
  { slug: "stable-diffusion", name: "Stable Diffusion", href: "https://stability.ai/" },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export function getModel(slug: string) {
  return models.find((m) => m.slug === slug) ?? null;
}

export function getContentType(slug: string): ContentTypeInfo | null {
  return contentTypes.find((c) => c.slug === slug) ?? null;
}

