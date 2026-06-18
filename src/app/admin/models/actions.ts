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

export async function createModel(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("models").insert({ name, slug, href: href || null, sort_order: sortOrder });

  revalidatePath("/admin/models");
}

export async function updateModel(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!id || !name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("models").update({ name, slug, href: href || null, sort_order: sortOrder }).eq("id", id);

  revalidatePath("/admin/models");
}

export async function deleteModel(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("models").delete().eq("id", id);

  revalidatePath("/admin/models");
}
