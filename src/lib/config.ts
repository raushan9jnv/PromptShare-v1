import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
});

function readEnv() {
  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables:\n${parsed.error.message}\n\n` +
        `Fix .env.local (local) or Vercel Environment Variables (prod).`,
    );
  }

  return parsed.data;
}

export const env = readEnv();

export const appConfig = {
  name: "PromptShare",
  description: "Browse and share prompts with media showcases.",
  storage: {
    promptAssetsBucket: "prompt-images",
  },
  links: {
    gemini: "https://gemini.google.com/app",
  },
} as const;

