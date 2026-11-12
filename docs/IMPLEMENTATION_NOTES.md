# Implementation notes

## Design decisions carried into code
- Deep teal `#073f3b` and `#042e2b`, teal accents, white/off-white surfaces and warm amber accent.
- Poppins headings and Inter body copy.
- Moderate 7–16px radii, restrained borders and shadows.
- Split hero with a profile-photo upload in the admin dashboard; the site owner still needs to upload a real portrait.
- Responsive desktop/tablet/mobile layouts.

## Functional mapping
| Requirement | Implementation |
|---|---|
| Eight public pages | `public/index.html`, `about.html`, `skills.html`, `projects.html`, `hackathons.html`, `certificates.html`, `experience.html`, `contact.html` |
| Dynamic public content | `GET /api/profile`, `/api/projects`, `/api/skills`, `/api/education`, `/api/achievements`, `/api/certificates`, `/api/experience` |
| Project search/filter/details | `assets/js/projects.js` |
| Theme toggle | `assets/js/main.js` + CSS theme variables |
| Contact validation/storage | `assets/js/contact.js`, `POST /api/contact` |
| Admin login | `POST /api/auth/login` |
| Admin CRUD and inbox | Projects, skills, education, achievements, certificates, experience and contact messages |
| Profile photo upload | Dashboard upload, `PUT /api/admin/profile/image`, Supabase Storage |
| Relational schema and RLS | `database/schema.sql`, `database/rls.sql`, `database/seed.sql` |

## Before submission
Run the test cases in the PRD/TRD against a configured Supabase project, verify deployment routing in Vercel, and capture screenshots of all pages at desktop and mobile widths. These changes have not yet been deployed; production use still requires Supabase credentials, the owner's photo and verified portfolio content.
