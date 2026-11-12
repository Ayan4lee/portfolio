-- Migration 003: richer skills. Reuses public.skills (no new table). Safe to re-run.
alter table public.skills add column if not exists description varchar(240);
alter table public.skills add column if not exists project_slugs text[] not null default '{}';
alter table public.skills add column if not exists updated_at timestamptz not null default now();
alter table public.skills drop constraint if exists skills_level_valid;
alter table public.skills add constraint skills_level_valid check (level in ('Beginner','Intermediate','Currently Learning'));
-- remove accidental duplicates before enforcing uniqueness
delete from public.skills a using public.skills b where a.id > b.id and a.category = b.category and a.name = b.name;
create unique index if not exists skills_category_name_uidx on public.skills(category, name);
-- RLS is unchanged: public read on skills exists; writes only through the authenticated Express admin API.
