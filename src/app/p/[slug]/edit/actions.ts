"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const UpdateSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(50000),
  category_slugs: z.array(z.string().min(1)).min(1),
  model_slugs: z.array(z.string().min(1)).min(1),
  tags: z.string().optional(),
  content_type: z.enum(["image", "video", "text", "music", "audio"]),
});

function excerptFromBody(body: string) {
  const oneLine = body.replace(/\s+/g, " ").trim();
  return oneLine.length > 220 ? `${oneLine.slice(0, 217)}...` : oneLine;
}

export async function updatePrompt(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    id: String(formData.get("id") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    category_slugs: formData.getAll("category_slugs").map((value) => String(value)),
    model_slugs: formData.getAll("model_slugs").map((value) => String(value)),
    tags: String(formData.get("tags") ?? ""),
    content_type: String(formData.get("content_type") ?? "text"),
  };

  const parsed = UpdateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/p/${raw.slug}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid form.")}`);
  }

  const tags = (parsed.data.tags ?? "").split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean).slice(0, 20);
  const { error } = await supabase
    .from("prompts")
    .update({
      title: parsed.data.title,
      body: parsed.data.body,
      excerpt: excerptFromBody(parsed.data.body),
      category_slug: parsed.data.category_slugs[0],
      model_slug: parsed.data.model_slugs[0],
      category_slugs: parsed.data.category_slugs,
      model_slugs: parsed.data.model_slugs,
      tags,
      content_type: parsed.data.content_type,
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) redirect(`/p/${parsed.data.slug}/edit?error=${encodeURIComponent(error.message)}`);
  redirect(`/p/${parsed.data.slug}`);
}