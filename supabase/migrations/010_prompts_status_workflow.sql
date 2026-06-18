-- Add a moderation status workflow to prompts.
-- Run after 006 (needs public.is_admin()).

alter table public.prompts add column if not exists status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'));
alter table public.prompts add column if not exists rejection_reason text;

-- Backfill: existing rows should stay publicly visible immediately (don't break the live site).
update public.prompts set status = 'approved' where status = 'pending';

create index if not exists prompts_status_idx on public.prompts (status);

-- Guard: only admins may change status (or rejection_reason) directly; client
-- attempts to self-approve are silently ignored rather than erroring, so the
-- existing edit flow in src/app/p/[slug]/edit keeps working unmodified.
create or replace function public.prompts_guard_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and not public.is_admin() then
    if new.status is distinct from old.status then
      new.status := old.status;
    end if;
    if new.rejection_reason is distinct from old.rejection_reason then
      new.rejection_reason := old.rejection_reason;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists prompts_guard_status_trigger on public.prompts;
create trigger prompts_guard_status_trigger
  before update on public.prompts
  for each row execute function public.prompts_guard_status();

-- Replace the old "select all" policy with a status-aware one:
-- public sees approved rows, owners see their own rows regardless of status,
-- admins see everything.
drop policy if exists "prompts_select_all" on public.prompts;
drop policy if exists "prompts_select_visible" on public.prompts;
create policy "prompts_select_visible"
  on public.prompts for select
  using (status = 'approved' or auth.uid() = user_id or public.is_admin());

-- Insert/update/delete-own policies are unchanged; status defaults to
-- 'pending' via the column default and is guarded from client mutation above.

-- prompt_assets: mirror the same visibility rule (approved prompt, owner, or admin).
drop policy if exists "prompt_assets_select_all" on public.prompt_assets;
drop policy if exists "prompt_assets_select_visible" on public.prompt_assets;
create policy "prompt_assets_select_visible"
  on public.prompt_assets for select
  using (
    exists (
      select 1 from public.prompts p
      where p.id = prompt_id
        and (p.status = 'approved' or p.user_id = auth.uid() or public.is_admin())
    )
  );
