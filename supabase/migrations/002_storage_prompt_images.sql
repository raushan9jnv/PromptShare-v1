-- Run after bucket `prompt-images` exists in Supabase Dashboard (Storage).
-- Ensures public reads and authenticated uploads only under `{user_id}/...`.

insert into storage.buckets (id, name, public)
values ('prompt-images', 'prompt-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read prompt-images" on storage.objects;
create policy "Public read prompt-images"
  on storage.objects for select
  using (bucket_id = 'prompt-images');

drop policy if exists "Auth upload own folder prompt-images" on storage.objects;
create policy "Auth upload own folder prompt-images"
  on storage.objects for insert
  with check (
    bucket_id = 'prompt-images'
    and auth.role() = 'authenticated'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "Auth update own folder prompt-images" on storage.objects;
create policy "Auth update own folder prompt-images"
  on storage.objects for update
  using (
    bucket_id = 'prompt-images'
    and auth.role() = 'authenticated'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "Auth delete own folder prompt-images" on storage.objects;
create policy "Auth delete own folder prompt-images"
  on storage.objects for delete
  using (
    bucket_id = 'prompt-images'
    and auth.role() = 'authenticated'
    and split_part(name, '/', 1) = auth.uid()::text
  );
