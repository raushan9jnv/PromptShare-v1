"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function approvePrompt(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("prompts").update({ status: "approved", rejection_reason: null }).eq("id", id);

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function rejectPrompt(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("prompts").update({ status: "rejected", rejection_reason: reason || null }).eq("id", id);

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function resetToPending(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("prompts").update({ status: "pending", rejection_reason: null }).eq("id", id);

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
