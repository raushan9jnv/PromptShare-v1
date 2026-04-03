import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
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
  /** First image URL for card thumbnail, if any */
  previewImageUrl: string | null;
};

export type PromptDetail = PromptListItem & {
  assets: PromptAssetRow[];
};

function mapListRow(
  row: PromptRow & { prompt_assets?: PromptAssetRow[] | null },
): PromptListItem {
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

export async function listPromptsTrending(limit = 30): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select(
      `
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
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByCategory(categorySlug: string): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select(
      `
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
    `,
    )
    .contains("category_slugs", [categorySlug])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByModel(modelSlug: string): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select(
      `
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
    `,
    )
    .contains("model_slugs", [modelSlug])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByContentType(type: ContentTypeSlug): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select(
      `
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
    `,
    )
    .eq("content_type", type)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function searchPrompts(query: string): Promise<PromptListItem[]> {
  const q = query.trim();
  if (!q) return listPromptsTrending(50);

  const supabase = await createSupabaseServerClient();
  const safe = q.replace(/[%_]/g, " ").slice(0, 120);
  const pattern = `%${safe}%`;
  const quotedPattern = `"${pattern.replace(/"/g, '""')}"`;

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

  const { data: fts, error: ftsError } = await supabase
    .from("prompts")
    .select(select)
    .textSearch("search_vector", safe, { type: "websearch", config: "english" })
    .order("created_at", { ascending: false })
    .limit(50);

  if (!ftsError && fts && fts.length > 0) {
    return fts.map((row) => mapListRow(row as never));
  }

  const { data, error } = await supabase
    .from("prompts")
    .select(select)
    .or(`title.ilike.${quotedPattern},body.ilike.${quotedPattern},excerpt.ilike.${quotedPattern}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function getPromptBySlug(slug: string): Promise<PromptDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select(
      `
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
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as PromptRow & { prompt_assets?: PromptAssetRow[] | null };
  const base = mapListRow(row);
  const assets = Array.isArray(row.prompt_assets) ? row.prompt_assets : [];
  const sorted = [...assets].sort((a, b) => a.sort_order - b.sort_order);

  return { ...base, assets: sorted };
}
