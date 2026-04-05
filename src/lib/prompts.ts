import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSeededPromptBySlug, searchSeededPrompts, seededPromptDetails, seededPromptList, type PromptAssetRole } from "@/lib/seeded-prompts";
import type { ContentTypeSlug } from "@/lib/taxonomy";

export type PromptRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  body: string;
  excerpt: string | null;
  author_handle?: string | null;
  category_slug: string;
  model_slug: string;
  category_slugs?: string[] | null;
  model_slugs?: string[] | null;
  tags?: string[] | null;
  content_type: ContentTypeSlug;
  created_at: string;
};

export type PromptAssetRow = {
  id: string;
  prompt_id: string;
  kind: "image" | "video" | "audio";
  public_url: string;
  sort_order: number;
  role?: PromptAssetRole;
  label?: string;
};

export type PromptListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  authorHandle: string | null;
  categorySlugs: string[];
  modelSlugs: string[];
  tags: string[];
  contentType: ContentTypeSlug;
  previewImageUrl: string | null;
};

export type PromptDetail = PromptListItem & {
  assets: PromptAssetRow[];
};

function mapListRow(row: PromptRow & { prompt_assets?: PromptAssetRow[] | null }): PromptListItem {
  const assets = Array.isArray(row.prompt_assets) ? row.prompt_assets : [];
  const sorted = [...assets].sort((a, b) => a.sort_order - b.sort_order);
  const firstImage = sorted.find((a) => a.kind === "image");

  const categorySlugs =
    Array.isArray(row.category_slugs) && row.category_slugs.length > 0
      ? row.category_slugs
      : row.category_slug
        ? [row.category_slug]
        : [];
  const modelSlugs =
    Array.isArray(row.model_slugs) && row.model_slugs.length > 0
      ? row.model_slugs
      : row.model_slug
        ? [row.model_slug]
        : [];
  const tags = Array.isArray(row.tags) ? row.tags : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    authorHandle: row.author_handle ?? null,
    categorySlugs,
    modelSlugs,
    tags,
    contentType: row.content_type,
    previewImageUrl: firstImage?.public_url ?? null,
  };
}

function uniqueBySlug<T extends { slug: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function mergeWithSeeded(primary: PromptListItem[], fallback: PromptListItem[], limit?: number) {
  const merged = uniqueBySlug([...primary, ...fallback]);
  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

async function queryPromptRows(options: {
  limit?: number;
  categorySlug?: string;
  modelSlug?: string;
  type?: ContentTypeSlug;
  slug?: string;
  search?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const select = `
    id,
    user_id,
    slug,
    title,
    body,
    excerpt,
    author_handle,
    category_slug,
    model_slug,
    category_slugs,
    model_slugs,
    tags,
    content_type,
    created_at,
    prompt_assets ( id, prompt_id, kind, public_url, sort_order )
  `;

  let query = supabase.from("prompts").select(select);

  if (options.categorySlug) query = query.contains("category_slugs", [options.categorySlug]);
  if (options.modelSlug) query = query.contains("model_slugs", [options.modelSlug]);
  if (options.type) query = query.eq("content_type", options.type);
  if (options.slug) {
    const { data, error } = await supabase
      .from("prompts")
      .select(select)
      .eq("slug", options.slug)
      .maybeSingle();

    return {
      rows: data ? [data as PromptRow & { prompt_assets?: PromptAssetRow[] | null }] : [],
      error,
    };
  }

  if (options.search) {
    const safe = options.search.replace(/[%_]/g, " ").slice(0, 120);
    const pattern = `%${safe}%`;
    const quotedPattern = `"${pattern.replace(/"/g, '""')}"`;

    const { data: fts, error: ftsError } = await supabase
      .from("prompts")
      .select(select)
      .textSearch("search_vector", safe, { type: "websearch", config: "english" })
      .order("created_at", { ascending: false })
      .limit(options.limit ?? 50);

    if (!ftsError && fts && fts.length > 0) {
      return { rows: fts as (PromptRow & { prompt_assets?: PromptAssetRow[] | null })[], error: null };
    }

    const { data, error } = await supabase
      .from("prompts")
      .select(select)
      .or(`title.ilike.${quotedPattern},body.ilike.${quotedPattern},excerpt.ilike.${quotedPattern}`)
      .order("created_at", { ascending: false })
      .limit(options.limit ?? 50);

    return { rows: (data ?? []) as (PromptRow & { prompt_assets?: PromptAssetRow[] | null })[], error };
  }

  query = query.order("created_at", { ascending: false });
  if (typeof options.limit === "number") query = query.limit(options.limit);
  const { data, error } = await query;
  return { rows: (data ?? []) as (PromptRow & { prompt_assets?: PromptAssetRow[] | null })[], error };
}

export async function listPromptsTrending(limit = 30): Promise<PromptListItem[]> {
  const { rows, error } = await queryPromptRows({ limit });
  const dbItems = error ? [] : rows.map((row) => mapListRow(row));
  return mergeWithSeeded(dbItems, seededPromptList, limit);
}

export async function listPromptsByCategory(categorySlug: string): Promise<PromptListItem[]> {
  const { rows, error } = await queryPromptRows({ categorySlug });
  const dbItems = error ? [] : rows.map((row) => mapListRow(row));
  const seeded = seededPromptList.filter((prompt) => prompt.categorySlugs.includes(categorySlug));
  return mergeWithSeeded(dbItems, seeded);
}

export async function listPromptsByModel(modelSlug: string): Promise<PromptListItem[]> {
  const { rows, error } = await queryPromptRows({ modelSlug });
  const dbItems = error ? [] : rows.map((row) => mapListRow(row));
  const seeded = seededPromptList.filter((prompt) => prompt.modelSlugs.includes(modelSlug));
  return mergeWithSeeded(dbItems, seeded);
}

export async function listPromptsByContentType(type: ContentTypeSlug): Promise<PromptListItem[]> {
  const { rows, error } = await queryPromptRows({ type });
  const dbItems = error ? [] : rows.map((row) => mapListRow(row));
  const seeded = seededPromptList.filter((prompt) => prompt.contentType === type);
  return mergeWithSeeded(dbItems, seeded);
}

export async function searchPrompts(query: string): Promise<PromptListItem[]> {
  const q = query.trim();
  if (!q) return listPromptsTrending(50);

  const { rows, error } = await queryPromptRows({ search: q, limit: 50 });
  const dbItems = error ? [] : rows.map((row) => mapListRow(row));
  return mergeWithSeeded(dbItems, searchSeededPrompts(q), 50);
}

export async function getPromptBySlug(slug: string): Promise<PromptDetail | null> {
  const { rows, error } = await queryPromptRows({ slug });
  if (!error && rows[0]) {
    const row = rows[0];
    const base = mapListRow(row);
    const assets = Array.isArray(row.prompt_assets) ? [...row.prompt_assets].sort((a, b) => a.sort_order - b.sort_order) : [];
    return { ...base, assets };
  }

  const seeded = getSeededPromptBySlug(slug);
  if (!seeded) return null;
  return seeded;
}

export async function listPromptCollections() {
  const seeded = seededPromptDetails;
  return [
    {
      slug: "before-after",
      title: "Before / After",
      description: "Transformation prompts with obvious visual payoff.",
      prompts: seeded.filter((prompt) => prompt.categorySlugs.includes("image-transform")).slice(0, 3),
    },
    {
      slug: "viral-hooks",
      title: "Viral Hook Packs",
      description: "Short-form prompt packs built for creators and marketers.",
      prompts: seeded.filter((prompt) => prompt.categorySlugs.includes("prompt-packs")).slice(0, 3),
    },
    {
      slug: "builders",
      title: "Prompting for Builders",
      description: "A quieter lane for software engineers and systems thinking.",
      prompts: seeded.filter((prompt) => prompt.categorySlugs.includes("software") || prompt.categorySlugs.includes("education")).slice(0, 2),
    },
  ];
}
