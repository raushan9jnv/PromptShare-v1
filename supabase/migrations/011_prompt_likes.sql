-- Prompt likes: one row per (user, prompt) pair. Likes count is denormalized onto prompts for fast reads.

create table if not exists public.prompt_likes (
  user_id   uuid not null references auth.users(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

create index if not exists prompt_likes_prompt_id_idx on public.prompt_likes (prompt_id);
create index if not exists prompt_likes_user_id_idx  on public.prompt_likes (user_id);

alter table public.prompt_likes enable row level security;

-- Anyone can read like counts / check their own likes
create policy "likes_select_all" on public.prompt_likes for select using (true);

-- Users can only insert/delete their own likes
create policy "likes_insert_own" on public.prompt_likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.prompt_likes for delete using (auth.uid() = user_id);

-- Denormalized like count on prompts table
alter table public.prompts add column if not exists likes_count int not null default 0;

-- Trigger to keep likes_count in sync
create or replace function public.sync_prompt_likes_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.prompts set likes_count = likes_count + 1 where id = NEW.prompt_id;
  elsif TG_OP = 'DELETE' then
    update public.prompts set likes_count = greatest(0, likes_count - 1) where id = OLD.prompt_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_sync_prompt_likes_count on public.prompt_likes;
create trigger trg_sync_prompt_likes_count
  after insert or delete on public.prompt_likes
  for each row execute function public.sync_prompt_likes_count();

-- Backfill counts from existing likes (if any)
update public.prompts p
set likes_count = (select count(*) from public.prompt_likes l where l.prompt_id = p.id);
