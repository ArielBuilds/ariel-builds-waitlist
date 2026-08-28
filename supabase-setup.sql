-- =========================================================
-- Ariel Builds — full Supabase setup
--
-- HOW TO RUN THIS:
--   Supabase dashboard -> SQL Editor -> New query
--   Paste all of this in -> click Run
--
-- Safe to run more than once.
-- =========================================================


-- ---------------------------------------------------------
-- 1. Discovery Session requests (the primary ask)
-- ---------------------------------------------------------
create table if not exists public.discovery_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  organization text,
  role         text,
  problem      text not null,
  timing       text,
  status       text not null default 'new'   -- new / replied / booked / closed
);

alter table public.discovery_requests enable row level security;

drop policy if exists "anyone can request a session" on public.discovery_requests;
create policy "anyone can request a session"
  on public.discovery_requests
  for insert
  to anon
  with check (true);

create index if not exists discovery_requests_created_at_idx
  on public.discovery_requests (created_at desc);


-- ---------------------------------------------------------
-- 2. Field Notes email list (the secondary ask)
-- ---------------------------------------------------------
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text,
  email      text not null unique,   -- unique = same email can't sign up twice
  headache   text
);

alter table public.waitlist enable row level security;

drop policy if exists "anyone can join the waitlist" on public.waitlist;
create policy "anyone can join the waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);


-- ---------------------------------------------------------
-- 3. Table privileges — THE STEP EVERY TUTORIAL SKIPS
--
-- Turning on Row Level Security is not enough on newer
-- Supabase projects. Postgres also needs an explicit grant,
-- or every insert fails with:
--     42501  permission denied for table
-- ---------------------------------------------------------
grant usage  on schema public to anon;
grant insert on table public.discovery_requests to anon;
grant insert on table public.waitlist           to anon;


-- ---------------------------------------------------------
-- 4. What is deliberately NOT granted
--
-- No select, update, or delete for anon. The public can add
-- a row to either table and can never read, change, or
-- remove one. You read them in the dashboard under
-- Table Editor.
-- ---------------------------------------------------------
