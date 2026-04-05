"use client";

import { useMemo, useState } from "react";

function parseVariables(text: string) {
  const matches = [...text.matchAll(/\{\{\s*([a-zA-Z0-9_ -]+)\s*\}\}/g)].map((match) => match[1]);
  return Array.from(new Set(matches));
}

export function VariableCustomizer({ body }: { body: string }) {
  const detected = useMemo(() => parseVariables(body), [body]);
  const defaults = detected.length > 0 ? detected : ["subject", "style", "tone"];
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(defaults.map((key) => [key, ""])));

  const customized = useMemo(() => {
    if (detected.length === 0) {
      const additions = Object.entries(values).filter(([, value]) => value.trim());
      if (additions.length === 0) return body;
      const intro = additions.map(([key, value]) => `${key}: ${value}`).join(" | ");
      return `${intro}\n\n${body}`;
    }

    return detected.reduce((result, key) => result.replaceAll(`{{${key}}}`, values[key] || `{{${key}}}`), body);
  }, [body, detected, values]);

  return (
    <div className="rounded-[28px] border border-border-default/80 bg-surface-card p-5 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.2)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-content-primary">Variable customizer</div>
          <p className="mt-1 text-sm text-content-secondary">Quickly adapt the prompt before you copy it.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {defaults.map((key) => (
          <label key={key} className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-content-muted">{key}</span>
            <input value={values[key] ?? ""} onChange={(event) => setValues((prev) => ({ ...prev, [key]: event.target.value }))} placeholder={`Add ${key}`} className="mt-2 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-content-primary outline-none focus:border-[var(--accent-strong)]" />
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-secondary px-4 py-4 text-sm leading-7 text-content-primary whitespace-pre-wrap">
        {customized}
      </div>
    </div>
  );
}
