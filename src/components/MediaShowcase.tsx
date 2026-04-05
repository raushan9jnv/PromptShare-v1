"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type ShowcaseAsset = {
  kind: "image" | "video" | "audio";
  public_url: string;
};

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-border-default bg-surface-secondary">
        <Image src={before} alt="Before" fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" unoptimized={isSupabasePublic(before)} />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className="relative h-full w-full">
            <Image src={after} alt="After" fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" unoptimized={isSupabasePublic(after)} />
          </div>
        </div>
        <div className="absolute inset-y-0" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
          <div className="h-full w-px bg-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur">
            ↔
          </div>
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">Before</div>
        <div className="absolute right-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">After</div>
      </div>
      <input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} className="w-full accent-[#E8883A]" aria-label="Before and after slider" />
    </div>
  );
}

export function MediaShowcase({ assets }: { assets: ShowcaseAsset[] }) {
  const items = useMemo(() => assets.filter((asset) => Boolean(asset.public_url)), [assets]);
  const imageItems = useMemo(() => items.filter((asset) => asset.kind === "image"), [items]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");

  if (items.length === 0) {
    return <div className="rounded-[28px] border border-dashed border-border-default bg-surface-card/70 p-8 text-center text-sm text-content-secondary">No preview media yet. The full prompt is still available below.</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {imageItems.length >= 2 ? <BeforeAfterSlider before={imageItems[0].public_url} after={imageItems[1].public_url} /> : null}

        {imageItems.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {imageItems.map((asset, index) => (
              <button key={asset.public_url} type="button" onClick={() => setLightbox(asset.public_url)} className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-border-default bg-surface-secondary text-left transition-all hover:border-[var(--accent-strong)]">
                <Image src={asset.public_url} alt="" fill sizes="(max-width: 768px) 100vw, 240px" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" unoptimized={isSupabasePublic(asset.public_url)} />
                <div className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">{index === 0 ? "Input" : index === 1 ? "Output" : `Alt ${index}`}</div>
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {items.filter((asset) => asset.kind !== "image").map((asset) => {
            if (asset.kind === "video") {
              return <video key={asset.public_url} src={asset.public_url} controls className="w-full overflow-hidden rounded-2xl border border-border-default bg-black" preload="metadata" />;
            }
            return (
              <div key={asset.public_url} className="rounded-2xl border border-border-default bg-surface-card p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-content-muted">Audio</div>
                <audio src={asset.public_url} controls className="mt-3 w-full" preload="metadata" />
              </div>
            );
          })}
        </div>
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white" onClick={() => setLightbox(null)}>
            Close
          </button>
          <div className="relative h-[84vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image src={lightbox} alt="" fill className="object-contain" sizes="90vw" priority unoptimized={isSupabasePublic(lightbox)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
