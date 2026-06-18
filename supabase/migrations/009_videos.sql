-- Videos table: admin-curated (for now) YouTube video listings, with room for
-- future user submissions (status workflow already in place).
-- Run after 006 and 007.

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null,
  title text not null,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  tag_ids uuid[] not null default '{}'::uuid[],
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_status_idx on public.videos (status);
create index if not exists videos_category_id_idx on public.videos (category_id);
create index if not exists videos_created_at_idx on public.videos (created_at desc);

alter table public.videos enable row level security;

-- Force non-admin inserts to 'pending'; admin-created videos are auto-approved.
create or replace function public.videos_guard_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if public.is_admin() then
      if new.status is null then
        new.status := 'approved';
      end if;
    else
      new.status := 'pending';
    end if;
  elsif tg_op = 'UPDATE' then
    if not public.is_admin() and new.status is distinct from old.status then
      new.status := old.status;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists videos_guard_status_trigger on public.videos;
create trigger videos_guard_status_trigger
  before insert or update on public.videos
  for each row execute function public.videos_guard_status();

drop policy if exists "videos_select_approved_or_admin" on public.videos;
create policy "videos_select_approved_or_admin"
  on public.videos for select
  using (status = 'approved' or public.is_admin() or auth.uid() = created_by);

drop policy if exists "videos_insert_authenticated" on public.videos;
create policy "videos_insert_authenticated"
  on public.videos for insert
  with check (auth.uid() is not null and (created_by is null or created_by = auth.uid()));

drop policy if exists "videos_update_admin" on public.videos;
create policy "videos_update_admin"
  on public.videos for update
  using (public.is_admin());

drop policy if exists "videos_delete_admin" on public.videos;
create policy "videos_delete_admin"
  on public.videos for delete
  using (public.is_admin());
