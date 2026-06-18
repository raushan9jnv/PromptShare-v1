import { categories } from "@/lib/taxonomy";

const emojiMap: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.slug, c.emoji])
);

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const emoji = emojiMap[slug] ?? "✦";
  return (
    <span className={className} role="img" aria-label={slug}>
      {emoji}
    </span>
  );
}
