-- Profiles table: per-user role + display info. Backs the admin system.
-- Run after 001-005.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  display_name text,
  avatar_url text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer helper to avoid RLS recursion when checking admin role.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own_or_admin" on public.profiles;
create policy "profiles_insert_own_or_admin"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

-- Auto-create a profile row when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name, email)
  values (
    new.id,
    'user',
    coalesce(split_part(new.email, '@', 1), 'user'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any existing auth users (idempotent).
insert into public.profiles (id, role, display_name, email)
select u.id, 'user', coalesce(split_part(u.email, '@', 1), 'user'), u.email
from auth.users u
on conflict (id) do nothing;

-- Keep profiles.email in sync if it was null (idempotent backfill).
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- One-time bootstrap: promote the designated owner email to admin.
-- Idempotent: re-running this is a no-op once the role is already 'admin'.
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and u.email = 'raushan9jnv@gmail.com'
  and p.role <> 'admin';
