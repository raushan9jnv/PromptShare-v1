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
  status?: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  likes_count?: number;
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
  previewImageUrl: string | null;
};

export type PromptDetail = PromptListItem & {
  userId: string;
  assets: PromptAssetRow[];
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  likesCount: number;
};

function mapListRow(row: PromptRow & { prompt_assets?: PromptAssetRow[] | null }): PromptListItem {
  const assets = Array.isArray(row.prompt_assets) ? row.prompt_assets : [];
  const sorted = [...assets].sort((a, b) => a.sort_order - b.sort_order);
  const firstImage = sorted.find((asset) => asset.kind === "image");

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    authorHandle: row.author_handle ?? null,
    categorySlugs: Array.isArray(row.category_slugs) && row.category_slugs.length > 0 ? row.category_slugs : row.category_slug ? [row.category_slug] : [],
    modelSlugs: Array.isArray(row.model_slugs) && row.model_slugs.length > 0 ? row.model_slugs : row.model_slug ? [row.model_slug] : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    contentType: row.content_type,
    previewImageUrl: firstImage?.public_url ?? null,
  };
}

const selectFields = `
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
  status,
  rejection_reason,
  likes_count,
  prompt_assets ( id, prompt_id, kind, public_url, sort_order )
`;

export async function listPromptsTrending(limit = 30): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prompts").select(selectFields).eq("status", "approved").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByCategory(categorySlug: string): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prompts").select(selectFields).eq("status", "approved").contains("category_slugs", [categorySlug]).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByModel(modelSlug: string): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prompts").select(selectFields).eq("status", "approved").contains("model_slugs", [modelSlug]).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByContentType(type: ContentTypeSlug): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prompts").select(selectFields).eq("status", "approved").eq("content_type", type).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function listPromptsByUserId(userId: string): Promise<PromptListItem[]> {
  // Used for a user's own dashboard context — RLS allows owners/admins to see
  // their own non-approved rows too, so no explicit status filter here.
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prompts").select(selectFields).eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function countPromptsByUserId(userId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase.from("prompts").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "approved");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function searchPrompts(query: string): Promise<PromptListItem[]> {
  const q = query.trim();
  if (!q) return listPromptsTrending(50);

  const supabase = await createSupabaseServerClient();
  const safe = q.replace(/[%_]/g, " ").slice(0, 120);
  const pattern = `%${safe}%`;
  const quotedPattern = `"${pattern.replace(/"/g, '""')}"`;

  const { data: fts, error: ftsError } = await supabase
    .from("prompts")
    .select(selectFields)
    .eq("status", "approved")
    .textSearch("search_vector", safe, { type: "websearch", config: "english" })
    .order("created_at", { ascending: false })
    .limit(50);

  if (!ftsError && fts && fts.length > 0) return fts.map((row) => mapListRow(row as never));

  const { data, error } = await supabase
    .from("prompts")
    .select(selectFields)
    .eq("status", "approved")
    .or(`title.ilike.${quotedPattern},body.ilike.${quotedPattern},excerpt.ilike.${quotedPattern}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow(row as never));
}

export async function getPromptBySlug(slug: string): Promise<PromptDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("prompts").select(selectFields).eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as PromptRow & { prompt_assets?: PromptAssetRow[] | null };
  const base = mapListRow(row);
  const assets = Array.isArray(row.prompt_assets) ? [...row.prompt_assets].sort((a, b) => a.sort_order - b.sort_order) : [];
  return {
    ...base,
    userId: row.user_id,
    assets,
    status: row.status ?? "approved",
    rejectionReason: row.rejection_reason ?? null,
    likesCount: row.likes_count ?? 0,
  };
}

export async function getLikedPromptsByUser(userId: string): Promise<PromptListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt_likes")
    .select(`prompt_id, prompts!inner ( ${selectFields} )`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapListRow((row as never as { prompts: PromptRow & { prompt_assets?: PromptAssetRow[] } }).prompts));
}
