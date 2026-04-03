"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

