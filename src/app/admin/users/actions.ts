"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function setUserRole(formData: FormData) {
  const currentProfile = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nextRole = String(formData.get("next_role") ?? "");

  if (!id || !["user", "editor", "admin"].includes(nextRole)) return;

  // Root admin can't demote themselves
  if (id === currentProfile.id && nextRole !== "admin") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("profiles").update({ role: nextRole }).eq("id", id);

  revalidatePath("/admin/users");
}
