"use client";

import { useFormStatus } from "react-dom";

export function FormSubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className} aria-disabled={pending}>
      {pending ? pendingText ?? "Please wait…" : children}
    </button>
  );
}

