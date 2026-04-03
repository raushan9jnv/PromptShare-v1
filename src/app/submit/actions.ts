"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { appConfig } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SubmitSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  body: z.string().trim().min(1, "Prompt text is required.").max(50000),
  category_slugs: z.array(z.string().min(1)).min(1, "Select at least one category."),
  model_slugs: z.array(z.string().min(1)).min(1, "Select at least one model."),
  tags: z.string().optional(),
  content_type: z.enum(["image", "video", "text", "music", "audio"]),
});

function slugify(input: string) {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return s || "prompt";
}

function makeSlug(title: string) {
  return `${slugify(title)}-${Math.random().toString(36).slice(2, 10)}`;
}

function excerptFromBody(body: string) {
  const oneLine = body.replace(/\s+/g, " ").trim();
  return oneLine.length > 220 ? `${oneLine.slice(0, 217)}…` : oneLine;
}

function assetKindFromMime(mime: string): "image" | "video" | "audio" | null {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return null;
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

export async function createPrompt(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("You must be signed in to submit."));
  }

  const raw = {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    category_slugs: formData.getAll("category_slugs").map((v) => String(v)),
    model_slugs: formData.getAll("model_slugs").map((v) => String(v)),
    tags: String(formData.get("tags") ?? ""),
    content_type: String(formData.get("content_type") ?? "text"),
  };

  // If the UI didn't send any selected values, show a friendly error.
  if (raw.category_slugs.length === 0) {
    redirect("/submit?error=" + encodeURIComponent("Select at least one category."));
  }
  if (raw.model_slugs.length === 0) {
    redirect("/submit?error=" + encodeURIComponent("Select at least one model."));
  }

  const parsed = SubmitSchema.safeParse(raw);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid form.";
    redirect("/submit?error=" + encodeURIComponent(msg));
  }

  const { title, body, category_slugs, model_slugs, content_type } = parsed.data;
  const tags = (parsed.data.tags ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20);
  const excerpt = excerptFromBody(body);
  const slug = makeSlug(title);

  const fileEntries = formData.getAll("files").filter((v): v is File => v instanceof File);
  const files = fileEntries.filter((f) => f.size > 0);

  const { data: inserted, error: insertError } = await supabase
    .from("prompts")
    .insert({
      user_id: user.id,
      slug,
      title,
      body,
      excerpt,
      category_slug: category_slugs[0],
      model_slug: model_slugs[0],
      category_slugs,
      model_slugs,
      tags,
      content_type,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    redirect(
      "/submit?error=" +
        encodeURIComponent(
          insertError?.message ??
            "Could not save prompt. Did you run the database migration in Supabase SQL Editor?",
        ),
    );
  }

  const promptId = inserted.id as string;
  const bucket = appConfig.storage.promptAssetsBucket;

  let sortOrder = 0;
  try {
    for (const file of files) {
      const kind = assetKindFromMime(file.type);
      if (!kind) continue;

      const path = `${user.id}/${promptId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) throw new Error(upErr.message);

      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const { error: aErr } = await supabase.from("prompt_assets").insert({
        prompt_id: promptId,
        kind,
        storage_path: path,
        public_url: publicUrl,
        sort_order: sortOrder++,
      });
      if (aErr) throw new Error(aErr.message);
    }
  } catch (e) {
    await supabase.from("prompts").delete().eq("id", promptId);
    redirect(
      "/submit?error=" +
        encodeURIComponent(e instanceof Error ? e.message : "Upload failed. Try again."),
    );
  }

  redirect(`/p/${slug}`);
}
