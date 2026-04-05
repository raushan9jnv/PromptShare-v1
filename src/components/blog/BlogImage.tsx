"use client";

/* eslint-disable @next/next/no-img-element */

export function BlogImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        const image = event.target as HTMLImageElement;
        if (!image.dataset.fallbackApplied) {
          image.dataset.fallbackApplied = "true";
          image.src = "/blog/prompt-engineering-101.svg";
          return;
        }

        image.style.display = "none";
      }}
    />
  );
}
