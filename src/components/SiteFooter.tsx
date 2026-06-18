import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-default bg-surface-card px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-[6px] w-[6px] rounded-[2px] bg-accent-600 dark:bg-accent-400" aria-hidden="true" />
          <span className="font-medium text-content-primary">PromptShare</span>
          <span className="text-content-muted">— creator-first AI prompt library</span>
        </div>
        <div className="flex gap-4">
          <Link href="/blog"     className="text-content-muted transition-colors hover:text-content-primary">Blog</Link>
          <Link href="/about"    className="text-content-muted transition-colors hover:text-content-primary">About</Link>
          <Link href="/services" className="text-content-muted transition-colors hover:text-content-primary">Services</Link>
        </div>
      </div>
    </footer>
  );
}
