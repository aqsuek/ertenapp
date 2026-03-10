-- ErtenApp - Initial schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Allow all for tasks"
  on public.tasks for all using (true) with check (true);

create table if not exists public.journal (
  id uuid primary key default gen_random_uuid(),
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table public.journal enable row level security;

create policy "Allow all for journal"
  on public.journal for all using (true) with check (true);

create table if not exists public.frames (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.frames enable row level security;

create policy "Allow all for frames"
  on public.frames for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('frames', 'frames', true)
on conflict (id) do nothing;

create policy "Allow public read for frames bucket"
  on storage.objects for select using (bucket_id = 'frames');

create policy "Allow public upload for frames bucket"
  on storage.objects for insert with check (bucket_id = 'frames');

create policy "Allow public delete for frames bucket"
  on storage.objects for delete using (bucket_id = 'frames');
