"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export function ImageLightbox({ urls }: { urls: string[] }) {
  const cleanUrls = useMemo(() => urls.filter(Boolean), [urls]);
  const [active, setActive] = useState<string | null>(null);

  if (cleanUrls.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cleanUrls.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(url)}
            className="group overflow-hidden rounded-xl border border-zinc-200 bg-white"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={url}
                alt="Preview"
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
            onClick={() => setActive(null)}
          >
            Close
          </button>

          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black">
              <Image
                src={active}
                alt="Preview"
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

