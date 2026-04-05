export type Category = {
  slug: string;
  name: string;
  description: string;
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
};

export const contentTypes: ContentTypeInfo[] = [
  { slug: "text", name: "Text", description: "Chat, writing, code, and planning prompts." },
  { slug: "image", name: "Image", description: "Visual prompts with transformation and style direction." },
  { slug: "video", name: "Video", description: "Scripts, shot lists, hooks, and edit direction." },
  { slug: "music", name: "Music", description: "Lyrics, compositions, and style prompts." },
  { slug: "audio", name: "Audio", description: "Voice, podcast, and sound design prompts." },
];

export const categories: Category[] = [
  { slug: "trending", name: "Trending", description: "What creators are opening, remixing, and copying right now." },
  { slug: "image-transform", name: "Image Transform", description: "Before-and-after prompts for restoration, remixing, and dramatic visual upgrades." },
  { slug: "image-prompts", name: "Image Prompts", description: "Ready-to-use prompts for image models, styles, and composition ideas." },
  { slug: "social-media", name: "Social Media", description: "Hooks, captions, carousels, and short-form content systems." },
  { slug: "youtube", name: "YouTube", description: "Titles, scripts, thumbnail angles, and retention prompts." },
  { slug: "marketing", name: "Marketing", description: "Ads, landing page copy, offers, and creative campaigns." },
  { slug: "design", name: "Design", description: "UX writing, interface prompts, and visual direction." },
  { slug: "prompt-packs", name: "Prompt Packs", description: "Bundled prompt systems for repeatable creator workflows." },
  { slug: "tiktok", name: "TikTok", description: "Short scripts, trend riffs, and viral CTA formats." },
  { slug: "instagram", name: "Instagram", description: "Reels, captions, carousel structure, and engagement prompts." },
  { slug: "linkedin", name: "LinkedIn", description: "Thought-leadership, positioning, and outreach prompts." },
  { slug: "seo", name: "SEO", description: "Keyword briefs, outlines, and search-focused writing prompts." },
  { slug: "email-marketing", name: "Email Marketing", description: "Subject lines, newsletters, drips, and cold email prompts." },
  { slug: "business", name: "Business", description: "Research, operations, planning, and proposal prompts." },
  { slug: "sales", name: "Sales", description: "Discovery, objections, scripts, and deal flow prompts." },
  { slug: "software", name: "Software / Dev", description: "Debugging, code review, architecture, and engineering prompts." },
  { slug: "sql", name: "SQL", description: "Query help, optimization, schema thinking, and data prompts." },
  { slug: "product", name: "Product", description: "PRDs, user stories, roadmaps, and product thinking prompts." },
  { slug: "education", name: "Education", description: "Study plans, UPSC prep, quizzes, and explanation prompts." },
  { slug: "productivity", name: "Productivity", description: "Templates, summaries, rewrites, and work accelerators." },
];

export const models: Model[] = [
  { slug: "gemini", name: "Gemini", href: "https://gemini.google.com/app" },
  { slug: "chatgpt", name: "ChatGPT", href: "https://chatgpt.com/" },
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

export const categoryHighlights: Record<string, CategoryHighlight> = {
  trending: {
    sampleOutputs: ["fresh ideas", "high-open prompts", "creator momentum"],
    accentClassName: "from-fuchsia-500/20 via-orange-400/10 to-transparent",
  },
  "image-transform": {
    sampleOutputs: ["before / after", "restoration", "luxury remix"],
    accentClassName: "from-amber-500/20 via-orange-400/15 to-transparent",
  },
  "image-prompts": {
    sampleOutputs: ["styles", "scene prompts", "visual directions"],
    accentClassName: "from-purple-500/20 via-fuchsia-400/12 to-transparent",
  },
  "social-media": {
    sampleOutputs: ["hooks", "captions", "carousel ideas"],
    accentClassName: "from-pink-500/20 via-orange-400/10 to-transparent",
  },
  youtube: {
    sampleOutputs: ["titles", "scripts", "thumbnail angles"],
    accentClassName: "from-red-500/20 via-orange-400/10 to-transparent",
  },
  marketing: {
    sampleOutputs: ["campaign angles", "offers", "copy systems"],
    accentClassName: "from-orange-500/20 via-yellow-400/10 to-transparent",
  },
  design: {
    sampleOutputs: ["UX copy", "brand voice", "visual notes"],
    accentClassName: "from-rose-500/20 via-pink-400/10 to-transparent",
  },
  "prompt-packs": {
    sampleOutputs: ["systems", "bundles", "repeatable workflows"],
    accentClassName: "from-violet-500/20 via-orange-400/10 to-transparent",
  },
  tiktok: {
    sampleOutputs: ["trend riffs", "short scripts", "CTAs"],
    accentClassName: "from-cyan-500/20 via-fuchsia-400/10 to-transparent",
  },
  instagram: {
    sampleOutputs: ["reels", "captions", "engagement ideas"],
    accentClassName: "from-amber-400/20 via-pink-500/10 to-transparent",
  },
  linkedin: {
    sampleOutputs: ["positioning", "thought pieces", "outreach"],
    accentClassName: "from-sky-500/20 via-cyan-400/10 to-transparent",
  },
  seo: {
    sampleOutputs: ["briefs", "keywords", "search outlines"],
    accentClassName: "from-lime-500/20 via-emerald-400/10 to-transparent",
  },
  "email-marketing": {
    sampleOutputs: ["subject lines", "drips", "newsletters"],
    accentClassName: "from-amber-500/20 via-orange-400/10 to-transparent",
  },
  business: {
    sampleOutputs: ["research", "ops docs", "proposals"],
    accentClassName: "from-violet-500/20 via-indigo-400/10 to-transparent",
  },
  sales: {
    sampleOutputs: ["discovery", "objections", "scripts"],
    accentClassName: "from-emerald-500/20 via-lime-400/10 to-transparent",
  },
  software: {
    sampleOutputs: ["debugging", "reviews", "system design"],
    accentClassName: "from-blue-500/20 via-cyan-400/10 to-transparent",
  },
  sql: {
    sampleOutputs: ["queries", "optimization", "schema help"],
    accentClassName: "from-teal-500/20 via-sky-400/10 to-transparent",
  },
  product: {
    sampleOutputs: ["PRDs", "roadmaps", "user stories"],
    accentClassName: "from-indigo-500/20 via-violet-400/10 to-transparent",
  },
  education: {
    sampleOutputs: ["UPSC prep", "study plans", "explanations"],
    accentClassName: "from-yellow-500/20 via-orange-400/10 to-transparent",
  },
  productivity: {
    sampleOutputs: ["templates", "summaries", "rewrites"],
    accentClassName: "from-fuchsia-500/20 via-violet-400/10 to-transparent",
  },
};
