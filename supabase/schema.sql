-- =====================================================
-- DHINESH AI PORTFOLIO — SUPABASE SCHEMA & MIGRATIONS
-- Run this entire file in the Supabase SQL editor
-- =====================================================

-- ── Extensions ──────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Admin Users (explicit role table) ───────────────
-- Only users whose auth UID appears here are admins.
-- To create the first admin:
--   1. Create the user in Supabase Dashboard > Authentication > Users
--   2. Run: INSERT INTO admin_users (user_id) VALUES ('<paste-uuid-here>');
create table if not exists admin_users (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ── Profile ──────────────────────────────────────────
create table if not exists profile (
  id             serial primary key,
  name           text,
  title          text,
  hero_intro     text,
  about_text     text,
  location       text,
  email          text,
  linkedin       text,
  github         text,
  phone          text,
  phone_visible  boolean not null default false,
  open_to_work   boolean not null default true,
  resume_url     text,
  photo_url      text,
  updated_at     timestamptz not null default now()
);

-- ── Statistics ───────────────────────────────────────
create table if not exists statistics (
  id            serial primary key,
  label         text not null,
  value         text not null,
  suffix        text default '',
  display_order integer not null default 99,
  is_published  boolean not null default true,
  updated_at    timestamptz not null default now()
);

-- ── Skills ───────────────────────────────────────────
create table if not exists skills (
  id            serial primary key,
  name          text not null,
  category      text not null,
  is_published  boolean not null default true,
  display_order integer not null default 99,
  updated_at    timestamptz not null default now()
);

-- ── Projects ─────────────────────────────────────────
create table if not exists projects (
  id             serial primary key,
  title          text not null,
  year           integer,
  description    text,
  tech_tags      text[] default '{}',
  result_metric  text,
  result_note    text,
  github_url     text,
  demo_url       text,
  thumbnail_url  text,
  is_featured    boolean not null default false,
  is_published   boolean not null default false,
  display_order  integer not null default 99,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── Internships / Experience ──────────────────────────
create table if not exists internships (
  id            serial primary key,
  role          text not null,
  company       text not null,
  location      text,
  start_date    text,
  end_date      text,
  is_ongoing    boolean not null default false,
  bullets       text[] default '{}',
  is_published  boolean not null default false,
  display_order integer not null default 99,
  updated_at    timestamptz not null default now()
);

-- ── Education ────────────────────────────────────────
create table if not exists education (
  id            serial primary key,
  degree        text not null,
  institution   text not null,
  location      text,
  start_year    integer,
  end_year      integer,
  grade         text,
  is_published  boolean not null default false,
  display_order integer not null default 99,
  updated_at    timestamptz not null default now()
);

-- ── Certificates ─────────────────────────────────────
create table if not exists certificates (
  id               serial primary key,
  title            text not null,
  issuer           text not null,
  issue_year       integer,
  expiry_year      integer,
  credential_id    text,
  verification_url text,
  image_url        text,
  description      text,
  is_published     boolean not null default false,
  display_order    integer not null default 99,
  updated_at       timestamptz not null default now()
);

-- ── Contact Messages ─────────────────────────────────
create table if not exists contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ── Timestamp triggers ───────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array['profile','statistics','skills','projects','internships','education','certificates']
  loop
    execute format('drop trigger if exists trg_updated_at on %I', t);
    execute format('create trigger trg_updated_at before update on %I for each row execute function update_updated_at()', t);
  end loop;
end $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
alter table admin_users      enable row level security;
alter table profile          enable row level security;
alter table statistics       enable row level security;
alter table skills           enable row level security;
alter table projects         enable row level security;
alter table internships      enable row level security;
alter table education        enable row level security;
alter table certificates     enable row level security;
alter table contact_messages enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

-- ── Public SELECT: published rows only ───────────────
create policy "public_read_profile"      on profile          for select using (true);
create policy "public_read_stats"        on statistics       for select using (is_published = true);
create policy "public_read_skills"       on skills           for select using (is_published = true);
create policy "public_read_projects"     on projects         for select using (is_published = true);
create policy "public_read_internships"  on internships      for select using (is_published = true);
create policy "public_read_education"    on education        for select using (is_published = true);
create policy "public_read_certificates" on certificates     for select using (is_published = true);

-- Public can insert contact messages (for the contact form)
create policy "public_insert_contact"    on contact_messages for insert with check (true);

-- ── Admin full access (all CRUD) ─────────────────────
create policy "admin_all_admin_users"    on admin_users      for all using (is_admin());
create policy "admin_all_profile"        on profile          for all using (is_admin());
create policy "admin_all_stats"          on statistics       for all using (is_admin());
create policy "admin_all_skills"         on skills           for all using (is_admin());
create policy "admin_all_projects"       on projects         for all using (is_admin());
create policy "admin_all_internships"    on internships      for all using (is_admin());
create policy "admin_all_education"      on education        for all using (is_admin());
create policy "admin_all_certificates"   on certificates     for all using (is_admin());
create policy "admin_read_contact"       on contact_messages for select using (is_admin());
create policy "admin_delete_contact"     on contact_messages for delete using (is_admin());

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
-- Run this in SQL editor (Supabase storage API):
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Public can read from the bucket
create policy "public_read_assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

-- Only admins can upload / delete
create policy "admin_write_assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and is_admin());

create policy "admin_delete_assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and is_admin());
