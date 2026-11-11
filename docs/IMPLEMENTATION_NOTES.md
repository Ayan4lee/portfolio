# Implementation notes

## Design decisions carried into code
- Deep teal `#073f3b` and `#042e2b`, teal accents, white/off-white surfaces and warm amber accent.
- Poppins headings and Inter body copy.
- Moderate 7–16px radii, restrained borders and shadows.
- Split hero with a clearly labelled portrait placeholder; no synthetic image is represented as the owner's real photo.
- Responsive desktop/tablet/mobile layouts.

## Functional mapping
| Requirement | Implementation |
|---|---|
| Four public pages | `public/index.html`, `skills-education.html`, `projects.html`, `contact.html` |
| Dynamic profile/projects/skills/education | `GET /api/profile`, `/api/projects`, `/api/skills`, `/api/education` |
| Project search/filter/details | `assets/js/projects.js` |
| Theme toggle | `assets/js/main.js` + CSS theme variables |
| Contact validation/storage | `assets/js/contact.js`, `POST /api/contact` |
| Admin login | `POST /api/auth/login` |
| Project CRUD | `/api/admin/projects` routes and admin UI |
| Relational schema and RLS | `database/schema.sql`, `database/rls.sql`, `database/seed.sql` |

## Before submission
Run the test cases in the PRD/TRD against a configured Supabase project, verify deployment routing in Vercel, and capture screenshots of all pages at desktop and mobile widths. The project cannot be considered production-ready until real credentials, the owner's photo and verified portfolio content are supplied.
