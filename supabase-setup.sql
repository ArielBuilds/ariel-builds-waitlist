-- =========================================================
-- Ariel Builds waitlist — Supabase setup
--
-- HOW TO RUN THIS:
--   Supabase dashboard -> SQL Editor -> New query
--   Paste all of this in -> click Run
-- =========================================================

-- 1. The table that holds signups.
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text,
  email      text not null unique,   -- unique = same email can't sign up twice
  headache   text
);

-- 2. Turn on Row Level Security.
--    Once this is on, NOTHING is allowed until a policy says so.
--    This is the switch that keeps your list private.
alter table public.waitlist enable row level security;

-- 3. Let anyone on the internet ADD a row (that's the signup form).
drop policy if exists "anyone can join the waitlist" on public.waitlist;
create policy "anyone can join the waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- 4. Notice there is NO policy for select/update/delete.
--    That means the public can add a signup but can never read,
--    change, or delete the list. You read it in the Supabase
--    dashboard under Table Editor -> waitlist.

-- Optional: faster sorting when the list gets long.
create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);
