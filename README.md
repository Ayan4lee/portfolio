# Mushtaque Ali — Personal Portfolio

A responsive, database-driven portfolio built with HTML5, CSS3, Bootstrap 5.3, Vanilla JavaScript, Node.js, Express and Supabase PostgreSQL. It follows the approved deep-teal / white visual direction, Poppins + Inter typography, moderate corner radius, split hero and responsive layouts.

## Included

- Eight public pages: Home, About, Skills, Projects, Hackathons, Certificates, Experience and Contact.
- Dynamic profile, project, skill, education, achievement, certificate and experience API endpoints.
- Project search, category filters and project details modal.
- Light/dark theme toggle and responsive navigation.
- Contact form with browser/server validation, CSRF token, honeypot and rate limiting.
- Admin CRUD for projects, skills, education, achievements, certificates and experience.
- Admin contact-message inbox with read/unread and delete actions.
- Admin profile-photo upload, stored in the public Supabase Storage bucket.
- Admin media uploads for project, achievement and certificate content.
- Admin login using bcrypt password hashes and a 30-minute signed JWT in an HttpOnly cookie.
- Protected admin API routes with server-side validation.
- Supabase schema, RLS policies and starter seed data.
- Vercel function entry point and local Express server.

## 1. Requirements

- Node.js 20 or newer
- A Supabase project
- npm

## 2. Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server only; never put it in browser code)
- `JWT_SECRET` (long random secret, at least 32 characters)
- `CSRF_SECRET` (a different long random secret)
- `SITE_ORIGIN=http://localhost:3000`
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` (use a strong unique password)

In Supabase SQL Editor, run these files in order:

1. `database/schema.sql`
2. `database/rls.sql`
3. `database/seed.sql`
4. `database/migration_002_enhancements.sql`
5. `database/seed_002_content.sql`
6. `database/migration_003_skills.sql`
7. `database/seed_003_skills.sql`

Create the initial admin account:

```bash
npm run create-admin
```

Then start the site:

```bash
npm run dev
```

Open http://localhost:3000.

## 3. Admin

- Login: `/admin/login.html`
- Dashboard: `/admin/index.html`
- Project management: `/admin/projects.html`
- Skills and education: `/admin/skills.html`, `/admin/education.html`
- Achievements, certificates and experience: `/admin/achievements.html`, `/admin/certificates.html`, `/admin/experience.html`
- Contact inbox: `/admin/messages.html`
- Profile photo: upload from the dashboard's Profile photo panel.

The admin login is intentionally unavailable until Supabase is configured and an admin user has been created. Admin API routes are protected on the server; hiding the dashboard UI is not treated as authorization.

## 4. Deploy to Vercel

Current public website: [ayanali-shaikh.vercel.app](https://ayanali-shaikh.vercel.app/).

1. Push this project to a private or public GitHub repository.
2. Import the repository into Vercel.
3. Add the same server environment variables in Vercel Project Settings.
4. Set `NODE_ENV=production` and `SITE_ORIGIN=https://ayanali-shaikh.vercel.app` (the exact public origin; no trailing slash).
5. Deploy and test all eight public pages, `/api/health`, contact submission and admin CRUD/inbox.

The `/api/index.js` entry point exports the Express application for Vercel. The normal local listener is separate in `server/index.js`.

## 5. Replace placeholders before publishing

The starter data is clearly provisional. Before making the site public:

- Replace the profile illustration by uploading your own professional photograph from the admin dashboard. A real portrait must be supplied by the site owner; the repository only contains a placeholder illustration.
- Add your actual public email, GitHub, LinkedIn and resume URLs in `site_profile`.
- Review the short/long biography and location.
- Confirm each project description, image, technologies, dates, live URL and repository URL accurately describe your actual work.
- Review skill proficiency estimates and education dates.
- Replace externally hosted sample project images with your own screenshots where possible.

Do not publish fake project claims or leave placeholder contact details as if they were real.

## 6. Demo mode vs real persistence

When Supabase environment variables are absent, profile, projects, skills and education use local demo content; the added content sections return empty lists. This fallback is process-local and not persistent. Contact storage and admin login are disabled without Supabase. Configure Supabase before using this as a real portfolio.

## 7. Security notes

- The Supabase service-role key is used only by the server.
- RLS is enabled on all tables; there are no anonymous write policies.
- Admin writes require the JWT cookie and signed double-submit CSRF token.
- Login and contact routes are rate-limited.
- User-supplied content is inserted into the DOM as escaped text.
- The auth cookie is HttpOnly, SameSite=Lax and Secure in production.
- Set strong, unique production secrets and keep `.env` out of Git.

## 8. Known scope boundaries

Skills, education, project, achievement, certificate and experience CRUD, as well as a contact-message inbox and profile-photo upload, are available in the admin area. Editing other profile fields is not included; update the profile row in Supabase directly. There is no image-cropping editor; uploaded media is stored in the public Supabase Storage bucket.
