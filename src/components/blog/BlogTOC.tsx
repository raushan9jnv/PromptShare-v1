"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function BlogTOC({ headings }: { headings: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto" aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-4">
        In this post
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`
                block text-[13px] leading-snug py-1.5 border-l-2 transition-colors duration-150
                ${h.level === 3 ? "pl-6" : "pl-4"}
                ${activeId === h.id
                  ? "border-accent-500 text-content-primary font-medium"
                  : "border-transparent text-content-muted hover:text-content-secondary"
                }
              `}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Parse headings from MDX content string for TOC */
export function extractHeadings(content: string): TOCItem[] {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TOCItem[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }

  return headings;
}
