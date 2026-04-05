"use client";

import { useState } from "react";

export function CopyPageButton() {
  const [copied, setCopied] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-content-secondary shadow-lg transition-all hover:text-content-primary hover:shadow-xl"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          Copy Page
        </>
      )}
    </button>
  );
}
