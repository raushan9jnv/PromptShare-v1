-- Add a public author handle to display as @handle without exposing emails.
-- This is stored on prompt creation (derived from the submitter's email prefix by default).

alter table public.prompts
  add column if not exists author_handle text;

create index if not exists prompts_author_handle_idx on public.prompts (author_handle);

