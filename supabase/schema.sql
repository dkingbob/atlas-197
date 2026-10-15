-- Atlas 197 — run once in Supabase › SQL Editor (safe to run again).
-- One row of progress per player; each player can only see and change their own row.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- the Data API may not expose new tables automatically: allow signed-in players (rows are still filtered by RLS)
revoke all on table public.progress from anon;
grant select, insert, update, delete on table public.progress to authenticated;

drop policy if exists "read own progress"   on public.progress;
drop policy if exists "insert own progress" on public.progress;
drop policy if exists "update own progress" on public.progress;
drop policy if exists "delete own progress" on public.progress;

create policy "read own progress" on public.progress for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "insert own progress" on public.progress for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.progress for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own progress" on public.progress for delete
  to authenticated using ((select auth.uid()) = user_id);
