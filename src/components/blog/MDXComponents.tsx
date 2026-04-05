"use client";

import { useState } from "react";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── MDX custom components ─── */

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") ?? "";

  function onCopy() {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="blog-code-block">
      {lang ? <span className="blog-code-lang">{lang}</span> : null}
      <button type="button" onClick={onCopy} className="blog-code-copy" aria-label="Copy code">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** Components map for MDX rendering */
export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof props.children === "string"
      ? props.children.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : undefined;
    return <h2 id={id} {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof props.children === "string"
      ? props.children.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : undefined;
    return <h3 id={id} {...props} />;
  },
  pre: ({ children }: { children: React.ReactElement<{ children: string; className?: string }> }) => {
    // Extract code from <pre><code>...</code></pre>
    if (children?.props) {
      return (
        <CodeBlock className={children.props.className}>
          {children.props.children}
        </CodeBlock>
      );
    }
    return <pre>{children}</pre>;
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
};
