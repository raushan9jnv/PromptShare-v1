"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type ShowcaseAsset = {
  kind: "image" | "video" | "audio";
  public_url: string;
};

export function MediaShowcase({ assets }: { assets: ShowcaseAsset[] }) {
  const items = useMemo(() => assets.filter((a) => Boolean(a.public_url)), [assets]);
  const imageItems = useMemo(() => items.filter((a) => a.kind === "image"), [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");
  const activeImage = imageItems[activeIndex];

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-border-default bg-surface-card/80 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-content-muted">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="mt-4 text-sm leading-6 text-content-secondary">
          No preview media yet. This prompt still includes the full text so creators can copy and adapt it.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {activeImage ? (
          <div className="overflow-hidden rounded-[28px] border border-border-default/80 bg-surface-card shadow-[0_24px_70px_-44px_rgba(15,23,42,0.45)]">
            <button
              type="button"
              onClick={() => setLightbox(activeImage.public_url)}
              className="group relative block aspect-[16/10] w-full overflow-hidden text-left"
            >
              <Image
                src={activeImage.public_url}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized={isSupabasePublic(activeImage.public_url)}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.5))]" />
              <div className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                Preview
              </div>
            </button>
          </div>
        ) : null}

        {imageItems.length > 1 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {imageItems.map((asset, index) => (
              <button
                key={asset.public_url}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all duration-200 ${
                  index === activeIndex
                    ? "border-accent-500 shadow-[0_16px_40px_-26px_rgba(243,115,53,0.45)]"
                    : "border-border-default hover:border-accent-300"
                }`}
              >
                <Image
                  src={asset.public_url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 180px"
                  className="object-cover"
                  unoptimized={isSupabasePublic(asset.public_url)}
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {items.filter((item) => item.kind !== "image").map((item) => {
            if (item.kind === "video") {
              return (
                <div
                  key={item.public_url}
                  className="overflow-hidden rounded-[24px] border border-border-default bg-surface-card"
                >
                  <video src={item.public_url} controls className="h-auto w-full" preload="metadata" />
                </div>
              );
            }

            return (
              <div
                key={item.public_url}
                className="rounded-[24px] border border-border-default bg-surface-card p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">Audio preview</div>
                <audio src={item.public_url} controls className="mt-4 w-full" preload="metadata" />
              </div>
            );
          })}
        </div>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
          <div className="relative h-[82vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox}
              alt=""
              fill
              className="object-contain"
              sizes="90vw"
              priority
              unoptimized={isSupabasePublic(lightbox)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

