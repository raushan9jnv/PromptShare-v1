"use client";

import { useState } from "react";

export function CopyButton({
  text,
  iconOnly = false,
  className = "",
}: {
  text: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy prompt"}
      title={copied ? "Copied" : "Copy prompt"}
      className={`inline-flex items-center justify-center rounded-full border border-border-default bg-white/88 text-content-primary transition-all hover:-translate-y-0.5 hover:border-[var(--accent-strong)] hover:bg-white dark:bg-white/10 ${iconOnly ? "h-9 w-9" : "gap-2 px-4 py-2 text-sm font-medium"} ${className}`}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {iconOnly ? null : copied ? "Copied" : "Copy"}
    </button>
  );
}
