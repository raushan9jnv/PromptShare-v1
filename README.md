# PromptShare (v1)

Prompt sharing website (Next.js + Supabase) where users can:
- Sign up / sign in
- Submit prompts (text) with media uploads (images/video/audio) **uploaded by users**
- Browse by categories, models, and content types
- Copy prompts and open them in tools like Gemini

> This project **does not generate images** or call paid LLM APIs on the server.

<<<<<<< HEAD
## What’s included in v1 (current progress)
- **Auth**: email/password signup + login (Supabase Auth)
- **Submit**: create prompts with:
  - Multiple categories
  - Multiple models
  - Tags (comma-separated)
  - Optional media uploads (image/video/audio) stored in Supabase Storage
- **Browse**:
  - Left sidebar navigation (Categories, Trending, Content type, Models)
  - Feeds: `/c/[slug]`, `/m/[slug]`, `/t/[slug]`
  - Prompt detail: `/p/[slug]` with copy button + media showcase
- **Search**: `/search?q=...` (full-text + fallback search)
- **No AI generation**: only stores text + user uploaded media
 
## Screenshots (UI tracking)

### Main Page
![Main Page](docs/screenshots/Screenshot%20(8).png)

### Create Tab Working
![Create Tab Working](docs/screenshots/Screenshot%20(9).png)

### Search Working
![Search Working](docs/screenshots/Screenshot%202026-04-03%20175200.png)

### Sign Up Working
![Sign Up Working](docs/screenshots/Screenshot%20(10).png)

### Sign In Working
![Sign In Working](docs/screenshots/Screenshot%20(11).png)


=======
>>>>>>> c190d88 (PromptShare v1)
## Tech stack
- **Next.js (App Router) + TypeScript + Tailwind**
- **Supabase**: Auth + Postgres + Storage

## Prerequisites
- **Node.js**: 20+ recommended
- **npm** (comes with Node)
- A **Supabase project** (free tier is fine)

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables
Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

- **Do not commit** `.env.local` (it is ignored by `.gitignore`).

### 3) Supabase SQL (required)
In Supabase Dashboard → **SQL Editor**, run these scripts in order:

1. `supabase/migrations/001_prompts_and_assets.sql`
2. `supabase/migrations/002_storage_prompt_images.sql`
3. `supabase/migrations/003_multi_categories_models_tags.sql`
4. `supabase/migrations/004_search_vector_trigger.sql`

### 4) Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

<<<<<<< HEAD
### Common commands

```bash
# Start dev server
npm run dev

# Production build check
npm run build

# Run production server locally (after build)
npm run start
```

=======
>>>>>>> c190d88 (PromptShare v1)
## How to verify it works end-to-end
- **Auth users**: Supabase Dashboard → Authentication → Users
- **Database rows**:
  - Supabase Dashboard → Table Editor → `prompts`
  - Supabase Dashboard → Table Editor → `prompt_assets`
- **Uploaded files**:
  - Supabase Dashboard → Storage → `prompt-images`
  - Files are stored under `{user_id}/{prompt_id}/...`

## Routes
- `/` Home
- `/search?q=...` Search
- `/c/[slug]` Category feed
- `/m/[slug]` Model feed
- `/t/[slug]` Content type feed
- `/p/[slug]` Prompt detail
- `/submit` Submit prompt (requires login)

## Git / releases
Suggested flow:
- `main` branch: ongoing development
- Tag releases: `v1.0.0`, `v1.0.1`, etc.

Example:

```bash
git tag -a v1.0.0 -m "PromptShare v1"
git push origin v1.0.0
```

<<<<<<< HEAD
## Security / secrets
- `.env.local` is ignored by `.gitignore` (`.env*`), so it will not be pushed.
- Never commit Supabase **service role** key. This project only uses the **anon public** key.

## Supabase notes
- **Storage bucket**: `prompt-images` (public)
- Storage path format: `{user_id}/{prompt_id}/{uuid}-{filename}`
- If prompt pages show a Next.js image optimizer `400`, Supabase public images are rendered with `unoptimized` fallback.

---
Bootstrapped with Next.js App Router.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> c190d88 (PromptShare v1)
