-- Admin-manageable taxonomy: categories, models, tags.
-- These mirror src/lib/taxonomy.ts so existing prompt rows keep working by slug.
-- Run after 006 (needs public.is_admin()).

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  color text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  href text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.models enable row level security;
alter table public.tags enable row level security;

-- categories
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories for select using (true);
drop policy if exists "categories_admin_insert" on public.categories;
create policy "categories_admin_insert" on public.categories for insert with check (public.is_admin());
drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update" on public.categories for update using (public.is_admin());
drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete" on public.categories for delete using (public.is_admin());

-- models
drop policy if exists "models_select_all" on public.models;
create policy "models_select_all" on public.models for select using (true);
drop policy if exists "models_admin_insert" on public.models;
create policy "models_admin_insert" on public.models for insert with check (public.is_admin());
drop policy if exists "models_admin_update" on public.models;
create policy "models_admin_update" on public.models for update using (public.is_admin());
drop policy if exists "models_admin_delete" on public.models;
create policy "models_admin_delete" on public.models for delete using (public.is_admin());

-- tags
drop policy if exists "tags_select_all" on public.tags;
create policy "tags_select_all" on public.tags for select using (true);
drop policy if exists "tags_admin_insert" on public.tags;
create policy "tags_admin_insert" on public.tags for insert with check (public.is_admin());
drop policy if exists "tags_admin_update" on public.tags;
create policy "tags_admin_update" on public.tags for update using (public.is_admin());
drop policy if exists "tags_admin_delete" on public.tags;
create policy "tags_admin_delete" on public.tags for delete using (public.is_admin());

create index if not exists categories_sort_order_idx on public.categories (sort_order);
create index if not exists models_sort_order_idx on public.models (sort_order);
create index if not exists tags_slug_idx on public.tags (slug);
