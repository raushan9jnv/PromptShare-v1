export type Category = {
  slug: string;
  name: string;
  description: string;
  count: number;
  color: string;
};

export type CategoryHighlight = {
  sampleOutputs: string[];
  accentClassName: string;
};

export type Model = {
  slug: string;
  name: string;
  href: string;
};

export type ContentTypeSlug = "image" | "video" | "text" | "music" | "audio";

export type ContentTypeInfo = {
  slug: ContentTypeSlug;
  name: string;
  description: string;
  count: number;
};

export const contentTypes: ContentTypeInfo[] = [
  { slug: "image", name: "Image", description: "Image prompts and transformations.", count: 148 },
  { slug: "text", name: "Text", description: "Writing, hooks, scripts, and prompt templates.", count: 92 },
  { slug: "video", name: "Video", description: "Reels, edits, shot ideas, and scripts.", count: 38 },
  { slug: "music", name: "Music", description: "Songwriting and music direction prompts.", count: 14 },
  { slug: "audio", name: "Audio", description: "Podcast, voice, and narration prompts.", count: 11 },
];

export const categories: Category[] = [
  { slug: "trending", name: "Trending", description: "What is getting opened and copied most.", count: 24, color: "#E8883A" },
  { slug: "image-transform", name: "Image Transform", description: "Before-after edits, restoration, fantasy, glow-ups.", count: 62, color: "#1E9D8B" },
  { slug: "social-media", name: "Social Media", description: "Hooks, captions, carousels, and short-form ideas.", count: 56, color: "#E8883A" },
  { slug: "prompt-packs", name: "Prompt Packs", description: "Grouped prompt bundles for repeatable workflows.", count: 18, color: "#8B5CF6" },
  { slug: "youtube", name: "YouTube", description: "Titles, scripts, thumbnails, retention angles.", count: 32, color: "#E4572E" },
  { slug: "marketing", name: "Marketing", description: "Ads, offers, funnels, and campaign copy.", count: 28, color: "#D97706" },
  { slug: "design", name: "Design", description: "Creative direction, brand voice, and interface copy.", count: 21, color: "#EC4899" },
  { slug: "software", name: "Software / Dev", description: "Code reviews, debugging, and engineering prompts.", count: 16, color: "#3B82F6" },
  { slug: "education", name: "Education", description: "Study help, UPSC framing, and structured learning.", count: 14, color: "#F59E0B" },
  { slug: "image-prompts", name: "Image Prompts", description: "Direct prompts for Midjourney, DALL-E, and similar tools.", count: 40, color: "#14B8A6" },
  { slug: "productivity", name: "Productivity", description: "Summaries, rewrites, and everyday accelerators.", count: 19, color: "#6366F1" },
  { slug: "instagram", name: "Instagram", description: "Reels, captions, and carousel copy.", count: 26, color: "#F97316" },
  { slug: "linkedin", name: "LinkedIn", description: "Thought leadership and professional writing.", count: 12, color: "#0EA5E9" },
  { slug: "sql", name: "SQL", description: "Query building and optimization.", count: 8, color: "#0F766E" },
  { slug: "business", name: "Business", description: "Research, proposals, and execution docs.", count: 10, color: "#7C3AED" },
];

export const models: Model[] = [
  { slug: "gemini", name: "Gemini", href: "https://gemini.google.com/app" },
  { slug: "chatgpt", name: "ChatGPT", href: "https://chat.openai.com/" },
  { slug: "claude", name: "Claude", href: "https://claude.ai/" },
  { slug: "copilot", name: "Copilot", href: "https://github.com/features/copilot" },
  { slug: "midjourney", name: "Midjourney", href: "https://www.midjourney.com/" },
  { slug: "dalle", name: "DALL-E", href: "https://labs.openai.com/" },
  { slug: "stable-diffusion", name: "Stable Diffusion", href: "https://stability.ai/" },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getModel(slug: string) {
  return models.find((model) => model.slug === slug) ?? null;
}

export function getContentType(slug: string): ContentTypeInfo | null {
  return contentTypes.find((type) => type.slug === slug) ?? null;
}

export const categoryHighlights: Record<string, CategoryHighlight> = {
  trending: { sampleOutputs: ["fresh drops", "high saves", "top opens"], accentClassName: "from-orange-500/25 via-amber-300/10 to-transparent" },
  "image-transform": { sampleOutputs: ["restore", "fantasy", "cinematic"], accentClassName: "from-teal-500/25 via-cyan-300/10 to-transparent" },
  "social-media": { sampleOutputs: ["hooks", "captions", "carousel copy"], accentClassName: "from-amber-500/25 via-orange-300/10 to-transparent" },
  "prompt-packs": { sampleOutputs: ["bundles", "systems", "series"], accentClassName: "from-violet-500/25 via-fuchsia-300/10 to-transparent" },
  youtube: { sampleOutputs: ["titles", "scripts", "thumbnail ideas"], accentClassName: "from-red-500/25 via-orange-300/10 to-transparent" },
  marketing: { sampleOutputs: ["offers", "ads", "angles"], accentClassName: "from-amber-500/25 via-yellow-300/10 to-transparent" },
  design: { sampleOutputs: ["direction", "voice", "UI copy"], accentClassName: "from-pink-500/25 via-rose-300/10 to-transparent" },
  software: { sampleOutputs: ["debug", "review", "ship"], accentClassName: "from-blue-500/25 via-sky-300/10 to-transparent" },
  education: { sampleOutputs: ["study plans", "notes", "explanations"], accentClassName: "from-yellow-500/25 via-amber-300/10 to-transparent" },
  "image-prompts": { sampleOutputs: ["styles", "scenes", "looks"], accentClassName: "from-teal-500/25 via-emerald-300/10 to-transparent" },
  productivity: { sampleOutputs: ["summaries", "templates", "rewrites"], accentClassName: "from-indigo-500/25 via-violet-300/10 to-transparent" },
  instagram: { sampleOutputs: ["reels", "captions", "comments"], accentClassName: "from-orange-500/25 via-pink-300/10 to-transparent" },
  linkedin: { sampleOutputs: ["posts", "outreach", "authority"], accentClassName: "from-sky-500/25 via-cyan-300/10 to-transparent" },
  sql: { sampleOutputs: ["queries", "optimization", "schemas"], accentClassName: "from-teal-600/25 via-sky-300/10 to-transparent" },
  business: { sampleOutputs: ["docs", "research", "plans"], accentClassName: "from-violet-500/25 via-indigo-300/10 to-transparent" },
};
