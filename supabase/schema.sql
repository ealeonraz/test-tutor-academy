-- ============================================================================
-- Go Tutor Academy — Supabase schema
-- ============================================================================
-- Run this entire file once in the Supabase dashboard:
--   Project → SQL Editor → New query → paste → Run.
-- It is idempotent-ish: safe to re-run during development, but it will DROP and
-- recreate policies. Do NOT run it against a database that already has real data
-- you care about without reviewing the DROPs below.
--
-- Auth (email/password, password reset) is handled by Supabase Auth, so there is
-- no users/password table here. Each auth user gets a row in `profiles` via the
-- handle_new_user() trigger below.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper: role enum-ish via check constraint (kept as text for flexibility)
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user (unifies the old `users` + `tutors` models)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  first_name      text,
  last_name       text,
  email           text,
  role            text not null default 'student' check (role in ('admin', 'tutor', 'student')),
  subjects        text[] not null default '{}',
  profile_link    text,
  bio             text,
  pay_rate        numeric,
  available_hours jsonb not null default '[]',   -- [{ day, hours: [{ start, end }] }]
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- subjects — admin-managed catalog of subjects
-- ----------------------------------------------------------------------------
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- appointments — tutoring sessions
-- ----------------------------------------------------------------------------
create table if not exists public.appointments (
  id                 uuid primary key default gen_random_uuid(),
  student_id         uuid references public.profiles (id) on delete cascade,
  tutor_id           uuid references public.profiles (id) on delete set null,
  start_time         timestamptz not null,
  end_time           timestamptz not null,
  subject            text,
  feedback_submitted boolean not null default false,
  feedback           text default '',
  join_url           text default '',
  files              text[] not null default '{}',
  created_at         timestamptz not null default now()
);
create index if not exists appointments_student_idx on public.appointments (student_id, start_time);
create index if not exists appointments_tutor_idx   on public.appointments (tutor_id, start_time);

-- ----------------------------------------------------------------------------
-- notes — tutor session notes about a student
-- ----------------------------------------------------------------------------
create table if not exists public.notes (
  id           uuid primary key default gen_random_uuid(),
  tutor_id     uuid references public.profiles (id) on delete cascade,
  student_id   uuid references public.profiles (id) on delete set null,
  student_name text,
  subject      text,
  note         text,
  date         timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
create index if not exists notes_tutor_idx on public.notes (tutor_id, date);

-- ----------------------------------------------------------------------------
-- feedback — post-session feedback submitted by students
-- ----------------------------------------------------------------------------
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references public.profiles (id) on delete set null,
  tutor_id    uuid references public.profiles (id) on delete set null,
  data        jsonb not null default '{}',   -- full form payload (rating, comments, etc.)
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- reviews — public testimonials shown on the home page
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  role        text,
  message     text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- actions — audit log
-- ----------------------------------------------------------------------------
create table if not exists public.actions (
  id                uuid primary key default gen_random_uuid(),
  action_type       text not null,
  user_id           uuid references public.profiles (id) on delete cascade,
  related_entity_id uuid,
  metadata          jsonb not null default '{}',
  created_at        timestamptz not null default now()
);

-- ============================================================================
-- Helper functions (SECURITY DEFINER bypasses RLS → no recursive policy loops)
-- ============================================================================
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

-- Auto-create a profile when a new auth user signs up. The frontend passes
-- first_name / last_name / role in the signUp options.data payload, which lands
-- in raw_user_meta_data.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- keep updated_at fresh on profiles
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles     enable row level security;
alter table public.subjects     enable row level security;
alter table public.appointments enable row level security;
alter table public.notes        enable row level security;
alter table public.feedback     enable row level security;
alter table public.reviews      enable row level security;
alter table public.actions      enable row level security;

-- ---- profiles ----
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() is not null);          -- any logged-in user can browse profiles

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles
  for delete using (public.is_admin());

-- ---- subjects ----
drop policy if exists subjects_select on public.subjects;
create policy subjects_select on public.subjects
  for select using (true);                            -- public list (used by search)

drop policy if exists subjects_write on public.subjects;
create policy subjects_write on public.subjects
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- appointments ----
drop policy if exists appointments_select on public.appointments;
create policy appointments_select on public.appointments
  for select using (
    student_id = auth.uid() or tutor_id = auth.uid() or public.is_admin()
  );

drop policy if exists appointments_insert on public.appointments;
create policy appointments_insert on public.appointments
  for insert with check (student_id = auth.uid() or public.is_admin());

drop policy if exists appointments_update on public.appointments;
create policy appointments_update on public.appointments
  for update using (
    student_id = auth.uid() or tutor_id = auth.uid() or public.is_admin()
  );

drop policy if exists appointments_delete on public.appointments;
create policy appointments_delete on public.appointments
  for delete using (
    student_id = auth.uid() or tutor_id = auth.uid() or public.is_admin()
  );

-- ---- notes ----
drop policy if exists notes_select on public.notes;
create policy notes_select on public.notes
  for select using (
    tutor_id = auth.uid() or student_id = auth.uid() or public.is_admin()
  );

drop policy if exists notes_write on public.notes;
create policy notes_write on public.notes
  for all using (tutor_id = auth.uid() or public.is_admin())
  with check (tutor_id = auth.uid() or public.is_admin());

-- ---- feedback ----
drop policy if exists feedback_select on public.feedback;
create policy feedback_select on public.feedback
  for select using (
    student_id = auth.uid() or tutor_id = auth.uid() or public.is_admin()
  );

drop policy if exists feedback_insert on public.feedback;
create policy feedback_insert on public.feedback
  for insert with check (auth.uid() is not null);

-- ---- reviews ----
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews
  for select using (true);                            -- public testimonials

drop policy if exists reviews_write on public.reviews;
create policy reviews_write on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- actions ----
drop policy if exists actions_select on public.actions;
create policy actions_select on public.actions
  for select using (public.is_admin());

drop policy if exists actions_insert on public.actions;
create policy actions_insert on public.actions
  for insert with check (user_id = auth.uid() or public.is_admin());

-- ============================================================================
-- Optional seed data (safe to delete). Subjects + a few sample reviews so the
-- home page and search filters aren't empty on first run.
-- ============================================================================
insert into public.subjects (name) values
  ('Mathematics'), ('Physics'), ('Chemistry'), ('Biology'),
  ('English'), ('Computer Science'), ('History'), ('Spanish')
on conflict (name) do nothing;

insert into public.reviews (name, role, message, avatar_url) values
  ('Gohan',     'Student', 'My tutor helped me ace my finals!',            null),
  ('Piccolo',   'Tutor',   'Tracking my hours has never been easier.',     null),
  ('Mr. Satan', 'Parent',  'Booking sessions for my kid is a breeze.',     null)
on conflict do nothing;
