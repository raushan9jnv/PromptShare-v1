"use client";

import { useMemo, useState } from "react";

type Option = { value: string; label: string };

export function MultiSelect({
  name,
  label,
  options,
  required,
  placeholder = "Select...",
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
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabels = useMemo(() => {
    const byValue = new Map(options.map((option) => [option.value, option.label] as const));
    return selected.map((value) => byValue.get(value) ?? value);
  }, [options, selected]);

  function toggle(value: string) {
    setSelected((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  }

  return (
    <div className="relative">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div className="text-sm font-medium text-content-primary">{label}</div>
        <button type="button" onClick={() => setSelected([])} className="text-xs font-medium text-content-muted transition-colors hover:text-content-primary">
          Clear
        </button>
      </div>

      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
      {required && selected.length === 0 ? <input type="hidden" name={`${name}__required`} value="" /> : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-left text-sm text-content-primary"
        aria-expanded={open}
      >
        <span className={selected.length ? "" : "text-content-muted"}>{selected.length ? selectedLabels.join(", ") : placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-[0_20px_60px_-38px_rgba(15,23,42,0.25)]">
          <div className="border-b border-border-subtle p-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter..."
              className="w-full rounded-xl border border-border-default bg-surface-secondary px-3 py-2 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]"
            />
          </div>
          <div className="max-h-64 overflow-auto p-2">
            {filtered.map((option) => {
              const checked = selected.includes(option.value);
              return (
                <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content-primary">
                  <input type="checkbox" checked={checked} onChange={() => toggle(option.value)} className="size-4 accent-[var(--accent-strong)]" />
                  <span>{option.label}</span>
                </label>
              );
            })}
            {filtered.length === 0 ? <div className="px-3 py-6 text-center text-sm text-content-muted">No matches</div> : null}
          </div>
          <div className="border-t border-border-subtle p-2">
            <button type="button" onClick={() => setOpen(false)} className="w-full rounded-xl bg-[var(--accent-strong)] px-3 py-2 text-sm font-medium text-white">
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
