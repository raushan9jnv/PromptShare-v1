-- Add multi-select fields: categories, models, tags.
-- Run after 001 and 002.

alter table public.prompts
  add column if not exists category_slugs text[] not null default '{}'::text[],
  add column if not exists model_slugs text[] not null default '{}'::text[],
  add column if not exists tags text[] not null default '{}'::text[];

-- Backfill from existing single columns if present.
update public.prompts
set category_slugs = array_remove(array_append(category_slugs, category_slug), null)
where array_length(category_slugs, 1) is null or array_length(category_slugs, 1) = 0;

update public.prompts
set model_slugs = array_remove(array_append(model_slugs, model_slug), null)
where array_length(model_slugs, 1) is null or array_length(model_slugs, 1) = 0;

-- Rebuild generated search_vector to include tags. (drop + recreate)
-- NOTE: generated columns require IMMUTABLE expressions; full-text functions are STABLE.
-- Use `004_search_vector_trigger.sql` instead (trigger-maintained column).

create index if not exists prompts_category_slugs_idx on public.prompts using gin (category_slugs);
create index if not exists prompts_model_slugs_idx on public.prompts using gin (model_slugs);
create index if not exists prompts_tags_idx on public.prompts using gin (tags);

