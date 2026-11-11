-- RLS is enabled on every table. Browser clients receive no privileged write access.
alter table public.site_profile enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;
-- Public read policies are intentionally limited to public portfolio content.
drop policy if exists "Public can read profile" on public.site_profile;
create policy "Public can read profile" on public.site_profile for select to anon, authenticated using (true);
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select to anon, authenticated using (true);
drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects for select to anon, authenticated using (is_published = true);
drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills" on public.skills for select to anon, authenticated using (true);
drop policy if exists "Public can read education" on public.education;
create policy "Public can read education" on public.education for select to anon, authenticated using (true);
-- No anon policies for messages or admin identities. Server service-role operations bypass RLS;
-- Express must authenticate and authorize every admin route before using that key.
