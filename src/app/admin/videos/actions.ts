"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractYouTubeVideoId } from "@/lib/youtube";

export async function createVideo(formData: FormData) {
  const profile = await requireAdmin();

  const url = String(formData.get("url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const tagIds = formData.getAll("tag_ids").map((value) => String(value)).filter(Boolean);

  const videoId = extractYouTubeVideoId(url);
  if (!videoId || !title) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("videos").insert({
    youtube_video_id: videoId,
    title,
    description: description || null,
    category_id: categoryId || null,
    tag_ids: tagIds,
    status: "approved",
    created_by: profile.id,
  });

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}

export async function updateVideoStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["pending", "approved", "rejected"].includes(status)) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("videos").update({ status }).eq("id", id);

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}

export async function deleteVideo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("videos").delete().eq("id", id);

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}
