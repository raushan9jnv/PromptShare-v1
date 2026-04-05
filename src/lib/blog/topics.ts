import type { BlogTopic } from "./types";

export const blogTopics: BlogTopic[] = [
  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    description: "Fundamentals & frameworks for writing effective prompts.",
  },
  {
    slug: "model-tips",
    name: "Model Tips",
    description: "Model-specific strategies for ChatGPT, Claude, Gemini & more.",
  },
  {
    slug: "advanced-techniques",
    name: "Advanced Techniques",
    description: "Chain-of-thought, few-shot, tree-of-thought & beyond.",
  },
  {
    slug: "use-cases",
    name: "Use Cases",
    description: "Practical guides for social media, SEO, coding & design.",
  },
  {
    slug: "news",
    name: "News",
    description: "Updates on new models, features & prompt tooling.",
  },
];

export function getTopicBySlug(slug: string): BlogTopic | undefined {
  return blogTopics.find((t) => t.slug === slug);
}
