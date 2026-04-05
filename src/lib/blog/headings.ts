export interface BlogHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): BlogHeading[] {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings: BlogHeading[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}
