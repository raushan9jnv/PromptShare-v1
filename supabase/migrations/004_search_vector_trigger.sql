-- Fix for: "generation expression is not immutable"
-- Postgres generated columns require IMMUTABLE expressions, but to_tsvector/websearch are STABLE.
-- Use a normal tsvector column updated by trigger instead.

alter table public.prompts drop column if exists search_vector;
alter table public.prompts add column if not exists search_vector tsvector;

create or replace function public.prompts_update_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A')
    || setweight(to_tsvector('english', coalesce(new.body, '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.excerpt, '')), 'C')
    || setweight(to_tsvector('english', array_to_string(coalesce(new.tags, '{}'::text[]), ' ')), 'C');
  return new;
end $$;

drop trigger if exists prompts_search_vector_trigger on public.prompts;
create trigger prompts_search_vector_trigger
before insert or update of title, body, excerpt, tags
on public.prompts
for each row
execute function public.prompts_update_search_vector();

update public.prompts
set title = title;

create index if not exists prompts_search_vector_idx on public.prompts using gin (search_vector);

