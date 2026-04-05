import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-default/80 bg-surface-card/80 px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 text-sm text-content-secondary sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold text-content-primary">PromptShare</div>
          <div className="mt-1">Creator-first prompts for visuals, social, and practical AI workflows.</div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/blog" className="transition-colors hover:text-content-primary">Blog</Link>
          <Link href="/about" className="transition-colors hover:text-content-primary">About</Link>
          <Link href="/services" className="transition-colors hover:text-content-primary">Services</Link>
        </div>
      </div>
    </footer>
  );
}
