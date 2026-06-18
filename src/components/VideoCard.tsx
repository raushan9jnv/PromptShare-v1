"use client";

import Image from "next/image";
import { useState } from "react";

import { YouTubeEmbed } from "@/components/YouTubeEmbed";

export function VideoCard({
  videoId,
  title,
  description,
  categoryName,
}: {
  videoId: string;
  title: string;
  description: string | null;
  categoryName: string | null;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="overflow-hidden rounded-[28px] border border-border-default/80 bg-surface-card shadow-[0_18px_60px_-40px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-strong)]">
      {playing ? (
        <YouTubeEmbed videoId={videoId} title={title} />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          className="group relative block aspect-video w-full overflow-hidden bg-surface-secondary"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--accent-strong)] shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
          {categoryName ? (
            <span className="absolute left-3 top-3 rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
              {categoryName}
            </span>
          ) : null}
        </button>
      )}

      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight text-content-primary">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-content-secondary line-clamp-3">{description}</p> : null}
      </div>
    </article>
  );
}
