"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = String(formData.get("color") ?? "#E8883A").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("categories").insert({
    name,
    slug,
    description: description || null,
    color: color || null,
    sort_order: sortOrder,
  });

  revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!id || !name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("categories")
    .update({ name, slug, description: description || null, color: color || null, sort_order: sortOrder })
    .eq("id", id);

  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("categories").delete().eq("id", id);

  revalidatePath("/admin/categories");
}
