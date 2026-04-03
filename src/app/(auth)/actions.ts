"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) {
    redirect(`/login?error=${encodeURIComponent("Email is required.")}`);
  }
  if (!password) {
    redirect(`/login?error=${encodeURIComponent("Password is required.")}`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email) {
    redirect(`/signup?error=${encodeURIComponent("Email is required.")}`);
  }
  if (password.length < 8) {
    redirect(
      `/signup?error=${encodeURIComponent("Password must be at least 8 characters.")}`,
    );
  }
  if (password !== confirmPassword) {
    redirect(`/signup?error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const msg = error.message.toLowerCase().includes("rate limit")
      ? "Email rate limit exceeded in Supabase. Wait a bit, use a different email, or disable Email Confirm for local dev (Supabase → Auth → Providers → Email)."
      : error.message;
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  // If email confirmation is enabled in Supabase, session will be null.
  if (!data.session) {
    redirect(
      `/login?success=${encodeURIComponent(
        "Account created. Please confirm your email, then sign in.",
      )}`,
    );
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

