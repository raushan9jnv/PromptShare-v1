"use client";

import { useOptimistic, useTransition } from "react";

import { toggleLike } from "@/app/actions/likes";

type Props = {
  promptId: string;
  promptSlug: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
};

export function LikeButton({ promptId, promptSlug, initialLiked, initialCount, isLoggedIn }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (_state, next: { liked: boolean; count: number }) => next,
  );

  function handleClick() {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    const next = { liked: !optimistic.liked, count: optimistic.count + (optimistic.liked ? -1 : 1) };
    startTransition(async () => {
      addOptimistic(next);
      await toggleLike(promptId, promptSlug);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={optimistic.liked ? "Unlike" : "Like"}
      className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
        optimistic.liked
          ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400"
          : "border-border-default bg-surface-card text-content-primary hover:border-rose-300 hover:text-rose-600"
      }`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={optimistic.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {optimistic.count > 0 ? optimistic.count : "Like"}
    </button>
  );
}
