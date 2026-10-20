-- Zarzamora: tablas, permisos y almacenamiento.
-- Pegá este archivo completo en Supabase > SQL Editor y ejecutalo una vez.
-- Se puede volver a ejecutar sin romper nada.

-- ───────────── Administradores ─────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins se ven a sí mismos" on public.admins;
create policy "admins se ven a sí mismos" on public.admins
  for select using (user_id = auth.uid());

-- ───────────── Apps ─────────────
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  category text not null default '',
  platform text not null default 'web' check (platform in ('web', 'android')),
  status text not null default 'desarrollo' check (status in ('estable', 'beta', 'desarrollo')),
  version text not null default '1.0',
  released_on date,
  language text not null default 'Español',
  size_label text not null default '',
  web_url text not null default '',
  apk_url text not null default '',
  repo_url text not null default '',
  icon_url text not null default '',
  color text not null default '#6B2BC2',
  is_pwa boolean not null default false,
  works_offline boolean not null default false,
  whats_new text[] not null default '{}',
  build_tools text[] not null default '{}',
  build_time text not null default '',
  build_quote text not null default '',
  privacy text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.apps enable row level security;

drop policy if exists "leer apps publicadas" on public.apps;
create policy "leer apps publicadas" on public.apps
  for select using (published or public.is_admin());

drop policy if exists "admin edita apps" on public.apps;
create policy "admin edita apps" on public.apps
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists apps_touch on public.apps;
create trigger apps_touch before update on public.apps
  for each row execute function public.touch_updated_at();

-- ───────────── Capturas y videos ─────────────
create table if not exists public.app_media (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps (id) on delete cascade,
  kind text not null check (kind in ('image', 'video', 'youtube')),
  url text not null,
  poster_url text,
  caption text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists app_media_app_idx on public.app_media (app_id, position);
alter table public.app_media enable row level security;

drop policy if exists "leer media de apps publicadas" on public.app_media;
create policy "leer media de apps publicadas" on public.app_media
  for select using (
    public.is_admin()
    or exists (select 1 from public.apps a where a.id = app_id and a.published)
  );

drop policy if exists "admin edita media" on public.app_media;
create policy "admin edita media" on public.app_media
  for all using (public.is_admin()) with check (public.is_admin());

-- ───────────── Textos del sitio ─────────────
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'
);
insert into public.site_settings (id) values (1) on conflict do nothing;
alter table public.site_settings enable row level security;

drop policy if exists "leer textos" on public.site_settings;
create policy "leer textos" on public.site_settings for select using (true);

drop policy if exists "admin edita textos" on public.site_settings;
create policy "admin edita textos" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ───────────── Archivos (íconos, capturas, videos, APKs) ─────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = true;

drop policy if exists "admin sube archivos" on storage.objects;
create policy "admin sube archivos" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin modifica archivos" on storage.objects;
create policy "admin modifica archivos" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin borra archivos" on storage.objects;
create policy "admin borra archivos" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
