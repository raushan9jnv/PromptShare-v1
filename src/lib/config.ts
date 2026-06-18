import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  // Server-only. Bypasses RLS — prefer the is_admin() RLS helper for admin
  // operations instead. Only fall back to this if an operation genuinely
  // can't be expressed in RLS (e.g. listing auth.users directly).
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
});

function readEnv() {
  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${parsed.error.message}\n\nFix .env.local (local) or Vercel Environment Variables (prod).`);
  }

  return parsed.data;
}

function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitUrl) return explicitUrl;

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelUrl) return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;

  return "https://promptshare.app";
}

export const env = readEnv();

export const appConfig = {
  name: "PromptShare",
  description: "A creator-first prompt library for image transformations, social content, and AI workflows.",
  siteUrl: getSiteUrl(),
  storage: {
    promptAssetsBucket: "prompt-images",
  },
  links: {
    gemini: "https://gemini.google.com/app",
  },
  admin: {
    bootstrapEmail: "raushan9jnv@gmail.com",
  },
} as const;
