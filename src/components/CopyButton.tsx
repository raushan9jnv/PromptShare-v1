"use client";

import { useState } from "react";

export function CopyButton({ text, variant = "default" }: { text: string; variant?: "default" | "prominent" }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (variant === "prominent") {
    return (
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-accent-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-700"
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
        {copied ? "Copied!" : "Copy prompt"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border-default bg-surface-card px-3.5 py-2 text-sm font-medium text-content-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary hover:border-accent-400"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {copied ? "Copied!" : "Quick copy"}
    </button>
  );
}

