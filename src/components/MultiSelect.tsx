"use client";

import { useMemo, useState } from "react";

type Option = { value: string; label: string };

export function MultiSelect({
  name,
  label,
  options,
  required,
  placeholder = "Select…",
}: {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  const selectedLabels = useMemo(() => {
    const byValue = new Map(options.map((o) => [o.value, o.label] as const));
    return selected.map((v) => byValue.get(v) ?? v);
  }, [options, selected]);

  return (
    <div className="relative">
      <div className="flex items-end justify-between gap-3">
        <div className="text-sm font-medium text-content-primary">{label}</div>
        <button
          type="button"
          className="text-xs font-medium text-content-muted hover:text-content-primary transition-colors"
          onClick={() => setSelected([])}
        >
          Clear
        </button>
      </div>

      {/* Hidden inputs so server action receives multiple values */}
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
      {required && selected.length === 0 ? (
        <input type="hidden" name={`${name}__required`} value="" />
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex w-full items-center justify-between rounded-xl border border-border-default bg-surface-secondary px-4 py-2.5 text-left text-sm text-content-primary transition-colors"
        aria-expanded={open}
      >
        <span className={selected.length ? "" : "text-content-muted"}>
          {selected.length ? selectedLabels.join(", ") : placeholder}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`text-content-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-border-default bg-surface-card shadow-lg shadow-black/10 dark:shadow-black/30">
          <div className="border-b border-border-subtle p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="w-full rounded-lg border border-border-default bg-surface-secondary px-3 py-2 text-sm text-content-primary outline-none placeholder:text-content-muted focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
            />
          </div>

          <div className="max-h-64 overflow-auto p-2">
            {filtered.map((o) => {
              const checked = selected.includes(o.value);
              return (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-content-secondary hover:bg-surface-secondary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(o.value)}
                    className="size-4 accent-accent-600"
                  />
                  <span>{o.label}</span>
                </label>
              );
            })}
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-content-muted">No matches</div>
            ) : null}
          </div>

          <div className="border-t border-border-subtle p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-accent-600 px-3 py-2 text-sm font-medium text-white hover:bg-accent-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
