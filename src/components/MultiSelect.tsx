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
        <div className="text-sm font-medium text-zinc-800">{label}</div>
        <button
          type="button"
          className="text-xs font-medium text-zinc-600 hover:text-zinc-950"
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
        className="mt-2 flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-950"
        aria-expanded={open}
      >
        <span className={selected.length ? "" : "text-zinc-500"}>
          {selected.length ? selectedLabels.join(", ") : placeholder}
        </span>
        <span className="text-zinc-500">▾</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none ring-zinc-950/10 focus:ring-4"
            />
          </div>

          <div className="max-h-64 overflow-auto p-2">
            {filtered.map((o) => {
              const checked = selected.includes(o.value);
              return (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(o.value)}
                    className="size-4"
                  />
                  <span>{o.label}</span>
                </label>
              );
            })}
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-zinc-500">No matches</div>
            ) : null}
          </div>

          <div className="border-t border-zinc-100 p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

