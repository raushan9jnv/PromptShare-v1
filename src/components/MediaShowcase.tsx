"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type ShowcaseAsset = {
  kind: "image" | "video" | "audio";
  public_url: string;
};

export function MediaShowcase({ assets }: { assets: ShowcaseAsset[] }) {
  const items = useMemo(() => assets.filter((a) => Boolean(a.public_url)), [assets]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const isSupabasePublic = (url: string) => url.includes("/storage/v1/object/public/");

  if (items.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No media uploaded for this prompt. You can still copy the text below.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((a) => {
          if (a.kind === "image") {
            return (
              <button
                key={a.public_url}
                type="button"
                onClick={() => setLightbox(a.public_url)}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white text-left"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={a.public_url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized={isSupabasePublic(a.public_url)}
                  />
                </div>
              </button>
            );
          }
          if (a.kind === "video") {
            return (
              <div
                key={a.public_url}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-black"
              >
                <video src={a.public_url} controls className="h-auto w-full" preload="metadata" />
              </div>
            );
          }
          return (
            <div
              key={a.public_url}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="text-xs font-medium text-zinc-500">Audio</div>
              <audio src={a.public_url} controls className="mt-2 w-full" preload="metadata" />
            </div>
          );
        })}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
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
