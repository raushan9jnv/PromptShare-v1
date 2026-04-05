"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { PromptAssetRole } from "@/lib/seeded-prompts";

export type ShowcaseAsset = {
  kind: "image" | "video" | "audio";
  public_url: string;
  role?: PromptAssetRole;
  label?: string;
};

const ROLE_LABELS: Record<PromptAssetRole, string> = {
  input: "Input",
  output: "Output",
  reference: "Reference",
  gallery: "Gallery",
};

export function MediaShowcase({ assets }: { assets: ShowcaseAsset[] }) {
  const items = useMemo(() => assets.filter((asset) => Boolean(asset.public_url)), [assets]);
  const imageItems = useMemo(() => items.filter((asset) => asset.kind === "image"), [items]);
  const inputAsset = imageItems.find((asset) => asset.role === "input") ?? null;
  const outputAssets = imageItems.filter((asset) => asset.role === "output" || asset.role === "gallery");
  const referenceAssets = imageItems.filter((asset) => asset.role === "reference");
  const showcaseImages = outputAssets.length > 0 ? outputAssets : imageItems.filter((asset) => asset !== inputAsset);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");
  const activeShowcase = showcaseImages[activeIndex] ?? showcaseImages[0] ?? inputAsset ?? null;

  useEffect(() => {
    setActiveIndex(0);
  }, [assets]);

  function openLightbox(index: number) {
    setLightbox(index);
  }

  function moveLightbox(direction: 1 | -1) {
    setLightbox((current) => {
      if (current === null || showcaseImages.length === 0) return current;
      return (current + direction + showcaseImages.length) % showcaseImages.length;
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[30px] border border-dashed border-border-default bg-surface-card/80 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-content-muted">IMG</div>
        <p className="mt-4 text-sm leading-7 text-content-secondary">
          No preview media yet. The prompt text is still ready to copy, and this area can later hold input/output examples.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {inputAsset && activeShowcase ? (
          <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
            {[inputAsset, activeShowcase].map((asset, index) => {
              const label = asset.label ?? ROLE_LABELS[asset.role ?? (index === 0 ? "input" : "output")];
              return (
                <button
                  key={`${asset.public_url}-${label}`}
                  type="button"
                  onClick={() => openLightbox(index === 0 ? 0 : activeIndex)}
                  className="group overflow-hidden rounded-[28px] border border-border-default/80 bg-surface-card text-left shadow-[0_18px_60px_-40px_rgba(15,23,42,0.28)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={asset.public_url}
                      alt=""
                      fill
                      sizes="(max-width: 1280px) 100vw, 480px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={isSupabasePublic(asset.public_url)}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.02),rgba(20,20,20,0.42))]" />
                    <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      {label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : activeShowcase ? (
          <div className="overflow-hidden rounded-[30px] border border-border-default/80 bg-surface-card shadow-[0_24px_70px_-44px_rgba(15,23,42,0.38)]">
            <button
              type="button"
              onClick={() => openLightbox(activeIndex)}
              className="group relative block aspect-[16/10] w-full overflow-hidden text-left"
            >
              <Image
                src={activeShowcase.public_url}
                alt=""
                fill
                sizes="(max-width: 1280px) 100vw, 820px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized={isSupabasePublic(activeShowcase.public_url)}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.06),rgba(20,20,20,0.52))]" />
              <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                {activeShowcase.label ?? ROLE_LABELS[activeShowcase.role ?? "output"]}
              </div>
            </button>
          </div>
        ) : null}

        {showcaseImages.length > 1 ? (
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Alternate outputs</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {showcaseImages.map((asset, index) => (
                <button
                  key={asset.public_url}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                    index === activeIndex
                      ? "border-accent-500 shadow-[0_16px_36px_-24px_rgba(242,90,44,0.42)]"
                      : "border-border-default hover:border-accent-300"
                  }`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={asset.public_url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 220px"
                      className="object-cover"
                      unoptimized={isSupabasePublic(asset.public_url)}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {referenceAssets.length > 0 ? (
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-content-muted">Reference inspiration</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {referenceAssets.map((asset) => (
                <div key={asset.public_url} className="overflow-hidden rounded-2xl border border-border-default bg-surface-card">
                  <div className="relative aspect-[4/3]">
                    <Image src={asset.public_url} alt="" fill sizes="(max-width: 768px) 50vw, 220px" className="object-cover" unoptimized={isSupabasePublic(asset.public_url)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {items.filter((asset) => asset.kind !== "image").map((asset) => {
            if (asset.kind === "video") {
              return (
                <div key={asset.public_url} className="overflow-hidden rounded-[24px] border border-border-default bg-surface-card">
                  <div className="border-b border-border-subtle px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-content-muted">
                    {asset.label ?? "Video preview"}
                  </div>
                  <video src={asset.public_url} controls className="h-auto w-full" preload="metadata" />
                </div>
              );
            }

            return (
              <div key={asset.public_url} className="rounded-[24px] border border-border-default bg-surface-card p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-content-muted">{asset.label ?? "Audio preview"}</div>
                <audio src={asset.public_url} controls className="mt-4 w-full" preload="metadata" />
              </div>
            );
          })}
        </div>
      </div>

      {lightbox !== null && showcaseImages[lightbox] ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-5 backdrop-blur-md" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
          {showcaseImages.length > 1 ? (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(-1); }} className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition-colors hover:bg-white/18">
                ‹
              </button>
              <button type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(1); }} className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition-colors hover:bg-white/18">
                ›
              </button>
            </>
          ) : null}
          <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between text-white">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Image viewer</div>
                <div className="mt-1 text-lg font-medium">
                  {showcaseImages[lightbox].label ?? ROLE_LABELS[showcaseImages[lightbox].role ?? "output"]}
                </div>
              </div>
              {showcaseImages.length > 1 ? <div className="text-sm text-white/70">{lightbox + 1} / {showcaseImages.length}</div> : null}
            </div>
            <div className="relative h-[72vh] overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
              <Image
                src={showcaseImages[lightbox].public_url}
                alt=""
                fill
                className="object-contain"
                sizes="90vw"
                priority
                unoptimized={isSupabasePublic(showcaseImages[lightbox].public_url)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
