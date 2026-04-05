"use client";

import { useEffect, useState } from "react";
import type { BlogHeading } from "@/lib/blog/headings";

export function BlogTOC({ headings }: { headings: BlogHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto" aria-label="Table of contents">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-content-muted">In this post</p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block border-l-2 py-1.5 text-[13px] leading-snug transition-colors duration-150 ${heading.level === 3 ? "pl-6" : "pl-4"} ${activeId === heading.id ? "border-accent-500 font-medium text-content-primary" : "border-transparent text-content-muted hover:text-content-secondary"}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
