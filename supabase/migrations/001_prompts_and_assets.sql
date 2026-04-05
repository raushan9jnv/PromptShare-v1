-- Run this in Supabase SQL Editor (or via supabase db push if you use CLI).
-- Prompts: user content + taxonomy. No AI generation — only stored text and user-uploaded media URLs.

create extension if not exists "pgcrypto";

-- Content kind: what the prompt is primarily for (separate from topic category).
do $$ begin
  create type public.content_type as enum ('image', 'video', 'text', 'music', 'audio');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,
  title text not null,
  body text not null,
  excerpt text,
  category_slug text not null,
  model_slug text not null,
  content_type public.content_type not null default 'text',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A')
    || setweight(to_tsvector('english', coalesce(body, '')), 'B')
    || setweight(to_tsvector('english', coalesce(excerpt, '')), 'C')
  ) stored
);

create index if not exists prompts_category_slug_idx on public.prompts (category_slug);
create index if not exists prompts_model_slug_idx on public.prompts (model_slug);
create index if not exists prompts_content_type_idx on public.prompts (content_type);
create index if not exists prompts_created_at_idx on public.prompts (created_at desc);
create index if not exists prompts_search_vector_idx on public.prompts using gin (search_vector);

create table if not exists public.prompt_assets (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.prompts (id) on delete cascade,
  kind text not null check (kind in ('image', 'video', 'audio')),
  storage_path text,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists prompt_assets_prompt_id_idx on public.prompt_assets (prompt_id);

alter table public.prompts enable row level security;
alter table public.prompt_assets enable row level security;

-- Prompts: public read, owners write
drop policy if exists "prompts_select_all" on public.prompts;
create policy "prompts_select_all"
  on public.prompts for select
  using (true);

drop policy if exists "prompts_insert_own" on public.prompts;
create policy "prompts_insert_own"
  on public.prompts for insert
  with check (auth.uid() = user_id);

drop policy if exists "prompts_update_own" on public.prompts;
create policy "prompts_update_own"
  on public.prompts for update
  using (auth.uid() = user_id);

drop policy if exists "prompts_delete_own" on public.prompts;
create policy "prompts_delete_own"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- Assets: readable if parent prompt exists (public prompts)
drop policy if exists "prompt_assets_select_all" on public.prompt_assets;
create policy "prompt_assets_select_all"
  on public.prompt_assets for select
  using (
    exists (select 1 from public.prompts p where p.id = prompt_id)
  );

drop policy if exists "prompt_assets_insert_own" on public.prompt_assets;
create policy "prompt_assets_insert_own"
  on public.prompt_assets for insert
  with check (
    exists (
      select 1 from public.prompts p
      where p.id = prompt_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "prompt_assets_update_own" on public.prompt_assets;
create policy "prompt_assets_update_own"
  on public.prompt_assets for update
  using (
    exists (
      select 1 from public.prompts p
      where p.id = prompt_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "prompt_assets_delete_own" on public.prompt_assets;
create policy "prompt_assets_delete_own"
  on public.prompt_assets for delete
  using (
    exists (
      select 1 from public.prompts p
      where p.id = prompt_id and p.user_id = auth.uid()
    )
  );

-- Search: keyword + full-text
create or replace function public.search_prompts(q text)
returns setof public.prompts
language sql
stable
as $$
  select *
  from public.prompts p
  where
    coalesce(trim(q), '') = ''
    or p.search_vector @@ websearch_to_tsquery('english', trim(q))
    or p.title ilike '%' || trim(q) || '%'
    or p.body ilike '%' || trim(q) || '%'
    or coalesce(p.excerpt, '') ilike '%' || trim(q) || '%';
$$;

grant execute on function public.search_prompts(text) to anon, authenticated;

comment on table public.prompts is 'User-submitted prompts; no server-side AI generation.';
comment on column public.prompts.content_type is 'Primary output type: image, video, text, music, audio.';
