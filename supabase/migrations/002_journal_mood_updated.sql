-- Journal: add mood (0-4) and updated_at

alter table public.journal
  add column if not exists mood smallint not null default 2,
  add column if not exists updated_at timestamptz default now();

update public.journal set updated_at = created_at where updated_at is null;
