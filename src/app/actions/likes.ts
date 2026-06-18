"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function toggleLike(promptId: string, promptSlug: string): Promise<{ liked: boolean; count: number }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be signed in to like prompts.");

  // Check existing like
  const { data: existing } = await supabase
    .from("prompt_likes")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (existing) {
    await supabase.from("prompt_likes").delete().eq("user_id", user.id).eq("prompt_id", promptId);
  } else {
    await supabase.from("prompt_likes").insert({ user_id: user.id, prompt_id: promptId });
  }

  const { data: prompt } = await supabase.from("prompts").select("likes_count").eq("id", promptId).maybeSingle();

  revalidatePath(`/p/${promptSlug}`);
  revalidatePath("/profile");

  return { liked: !existing, count: prompt?.likes_count ?? 0 };
}
