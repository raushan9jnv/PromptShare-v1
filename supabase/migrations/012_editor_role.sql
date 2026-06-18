-- Add 'editor' role: can submit prompts (auto-approved), cannot access admin panel.
-- Root admins can assign this role via the Users page.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'editor', 'admin'));

-- Helper to check if current user can submit without approval
create or replace function public.can_auto_approve()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

grant execute on function public.can_auto_approve() to authenticated;
