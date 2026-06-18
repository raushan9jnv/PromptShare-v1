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

export async function createTag(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  if (!name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("tags").insert({ name, slug });

  revalidatePath("/admin/tags");
}

export async function updateTag(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  if (!id || !name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("tags").update({ name, slug }).eq("id", id);

  revalidatePath("/admin/tags");
}

export async function deleteTag(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("tags").delete().eq("id", id);

  revalidatePath("/admin/tags");
}
