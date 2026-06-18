import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  role: "user" | "admin";
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
};

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

/**
 * Use at the top of admin server components/actions. Redirects non-admins to "/".
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/");
  }
  return profile;
}
