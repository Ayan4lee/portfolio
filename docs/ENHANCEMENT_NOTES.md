# Enhancement notes — 12 November 2026

## Run order (Supabase SQL editor)
1. `database/migration_002_enhancements.sql` (tables, columns, indexes, RLS, `portfolio-media` bucket)
2. `database/seed_002_content.sql` (REPLACES old demo skills, education, demo projects)

## Vercel environment variables (Production)
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (rotated), JWT_SECRET (32+ chars), CSRF_SECRET (32+ chars), SITE_ORIGIN=https://ayanali-shaikh.vercel.app, NODE_ENV=production, IP_HASH_SALT. Set a strong admin password with `npm run create-admin`.

## Placeholders to replace
- Profile photo: Admin has no profile editor; set `site_profile.profile_image_url` in Supabase (upload to bucket first).
- CV: set `site_profile.resume_url` (button stays disabled until then).
- Certificates: Admin > Certificates > Edit > upload file. Issuer text was derived from event names; correct if needed.
- Project images: Admin > Projects > Edit > upload. Snake Game uses `/assets/img/snake-concept.svg`, a labelled concept illustration.

## Not verified here
No Supabase or Vercel access, and npm install was not run. Only `node --check` syntax checks were done. Follow the production test checklist before announcing it as live.
<<<<<<< HEAD

## Skills page update (migration 003)
Run in order: `database/migration_003_skills.sql`, then `database/seed_003_skills.sql` (replaces all skill rows). Skills are managed at /admin/skills.html. Related projects are matched by project slug, so keep slugs unchanged. Levels: Beginner, Intermediate, Currently Learning (no percentages).
=======
>>>>>>> f9f711a3e075c773e85e6413580903706b497783
