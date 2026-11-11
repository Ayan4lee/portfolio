# Product Requirements Document (PRD)
## Dynamic Personal Portfolio Website with Admin Dashboard

| Field | Value |
|---|---|
| **Course** | Web Engineering (Complex Engineering Problem), Department of Computer Systems Engineering, Mehran University of Engineering and Technology, Jamshoro |
| **Instructor** | Engr. Zoha Memon |
| **Assignment type** | Individual Complex Engineering Problem (CEP) |
| **Submission deadline** | 14-11-2026 |
| **Document version** | 2.0 (Revised draft) |
| **Document date** | 11-11-2026 |
| **Author** | [Student Name] |
| **Companion document** | `TRD.md` (Technical Requirements Document) |
| **Status** | Revised for review; Phase 2 starts after approval. |

---

## Table of Contents

1. [Project Overview and Objectives](#1-project-overview-and-objectives)
2. [Target Audience](#2-target-audience)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Website Page Structure](#6-website-page-structure)
7. [Detailed Features of Every Page](#7-detailed-features-of-every-page)
8. [Admin Dashboard Requirements](#8-admin-dashboard-requirements)
9. [Contact Form Functionality](#9-contact-form-functionality)
10. [User Journeys](#10-user-journeys)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Project Scope and Limitations](#12-project-scope-and-limitations)
13. [Content Placeholders and Information Still Needed](#13-content-placeholders-and-information-still-needed)
14. [Milestones Summary](#14-milestones-summary)
15. [Traceability to University Requirements](#15-traceability-to-university-requirements)

---

## 1. Project Overview and Objectives

### 1.1 Overview

This project is a professional, modern, responsive and database-driven personal portfolio website. Visitors can learn about the site owner, review skills and education, browse projects, and send a message. The site owner manages projects through a password-protected admin dashboard. Profile, skills and education content is stored in Supabase; skills and education are read dynamically, while optional admin modules may be added later.

Content is stored in Supabase PostgreSQL and retrieved by the Express.js backend using `@supabase/supabase-js`. The application is deployed on Vercel. The frontend uses HTML, CSS, Bootstrap and Vanilla JavaScript; the backend uses Node.js and Express.js.

### 1.2 Business and academic objectives

| ID | Objective | Measure of success |
|---|---|---|
| OBJ-1 | Present the owner's profile professionally to recruiters, peers and evaluators | Four consistent, polished pages that read well on desktop and mobile |
| OBJ-2 | Demonstrate dynamic, database-driven content | Adding a record in the admin dashboard changes the public site with no HTML edit |
| OBJ-3 | Provide a secure content management interface | Only an authenticated admin can add, edit or delete content; unauthorized access attempts are blocked |
| OBJ-4 | Capture visitor enquiries reliably | Valid contact submissions are stored in the database; an admin inbox is optional |
| OBJ-5 | Satisfy all ten university requirements and the assessment rubric | Every requirement traceable to a feature and a test (Section 15) |
| OBJ-6 | Be deployable and demonstrable | Live Vercel deployment, with documented setup and a local development path |
| OBJ-7 | Reflect the student's own identity and design decisions | All content, branding and design choices are the student's own (requirement 10) |

### 1.3 Problem statement

A static portfolio is hard to keep current because every change needs a code edit. A database-driven portfolio keeps projects, skills and education current without editing page markup. The required admin dashboard manages projects; skills and education can be maintained directly in Supabase. Doing this securely, with validation, parameterized database operations, authentication and responsive design, is the engineering challenge this CEP evaluates.

### 1.4 Complex Engineering Problem characteristics addressed

The assignment marks these characteristics as applicable, and the design addresses each:

| CEP characteristic | How it appears in this project |
|---|---|
| Depth of knowledge required | JavaScript, Node.js, Express.js, PostgreSQL, Bootstrap, HTTP, authentication and web security combined |
| Range of conflicting requirements | Security vs. simplicity, stateless serverless hosting vs. authentication, deadline vs. scope, RLS vs. privileged server access |
| Depth of analysis required | Stack selection, hosting feasibility, schema design and security trade-offs (documented in the TRD) |
| Beyond codes/standards of practice | Applying OWASP-style practices and accessibility guidelines beyond what the assignment spells out |
| Interdependence of components | Browser, Node.js runtime, Supabase database, admin and public flows depend on each other |
| Judgement in decision making | Decisions recorded with alternatives and justification in the TRD |

---

## 2. Target Audience

| Audience | Needs | Priority |
|---|---|---|
| Recruiters and hiring managers | Quick view of skills, education, projects and a way to make contact | Primary |
| Course instructor / evaluators | Evidence of every assignment requirement, working CRUD, validation, security and a clean demo | Primary |
| Peers, collaborators, clients | Browse projects and see technology used | Secondary |
| Site owner (admin) | Easy, secure project updates through a simple admin dashboard | Primary (internal) |

**Device context:** a significant share of recruiters and peers will open the site on phones, so mobile usability is required, not optional.

---

## 3. User Personas

Personas are illustrative archetypes used for design decisions. They are not claims about real people.

### Persona A: Technical Recruiter

- **Goal:** Decide within a couple of minutes whether the owner is worth contacting.
- **Behaviour:** Scans the Home page, jumps to Projects, filters by technology, opens a project, then contacts the owner.
- **Frustrations:** Slow pages, unclear project descriptions, broken links, forms that fail silently.
- **Needs from the site:** Clear headline, filterable projects with tech tags, working links, a simple contact form with visible confirmation.

### Persona B: Course Instructor / Evaluator

- **Goal:** Verify the assignment requirements are met and that the work is original.
- **Behaviour:** Visits each page, tests the contact form with valid and invalid input, tries `/admin` without logging in, then reviews CRUD during the live demo.
- **Frustrations:** Missing validation, insecure queries, content hard-coded in HTML, missing documentation.
- **Needs from the site:** Requirements visibly met, clean code structure, setup documentation, test evidence.

### Persona C: Site Owner (Administrator)

- **Goal:** Keep the portfolio current with minimal effort.
- **Behaviour:** Logs in, adds a new project, fixes a typo in a skill, reads new messages, logs out.
- **Frustrations:** Confusing admin screens, accidental deletions, lost session mid-edit.
- **Needs from the site:** Simple project forms, confirmation before delete, and clear success/error messages.

### Persona D: Casual Visitor / Peer

- **Goal:** Browse projects for inspiration or collaboration.
- **Behaviour:** Uses search and filters, switches to dark mode, reads about the owner.
- **Needs from the site:** Fast, pleasant navigation and readable content in light and dark themes.

---

## 4. Functional Requirements

Priority uses MoSCoW: **M** = Must, **S** = Should, **C** = Could.

### 4.1 Public website

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The site shall provide four interconnected pages: Home/About, Skills & Education, Projects, Contact, with a consistent navbar and footer on every page. | M |
| FR-02 | The navbar shall collapse into a toggle menu on small screens and highlight the active page. | M |
| FR-03 | The Home page shall show a hero section, an about summary, and featured projects loaded from the database. | M |
| FR-04 | The Skills & Education page shall display skills, grouped by category, loaded from the database. | M |
| FR-05 | The Skills & Education page shall display education entries from the database in a timeline ordered newest first. | M |
| FR-06 | The Projects page shall display all published projects from the database as responsive cards. | M |
| FR-07 | Visitors shall be able to filter projects by category and technology without a page reload (JavaScript). | M |
| FR-08 | Visitors shall be able to search projects by keyword with live results (JavaScript). | M |
| FR-09 | Each project card shall offer a details view (modal) with full description, technologies, and live/repository links. | S |
| FR-10 | Adding, editing or deleting a record via the admin dashboard shall change the public site without any HTML edit. | M |
| FR-11 | Every page shall show a friendly empty state when the database has no records for a section. | M |
| FR-12 | The site shall provide a dark/light theme toggle that remembers the visitor's choice (JavaScript). | M* |
| FR-13 | Skill proficiency bars shall animate when they scroll into view (JavaScript). | M* |
| FR-14 | Experience durations (for example "3 years") shall be calculated from stored start dates (JavaScript). | M* |
| FR-15 | The site shall provide a custom 404 page and a friendly error page that reveals no technical details. | S |
| FR-16 | The footer shall show the owner's social/profile links from the database and a discreet admin login link. | S |

\* Selected by the owner as a required interaction. The university minimum is two meaningful interactions; this project delivers five plus form validation.

### 4.2 Contact form

| ID | Requirement | Priority |
|---|---|---|
| FR-20 | The Contact page shall provide a form with name, email, subject and message. | M |
| FR-21 | The form shall validate input in the browser with JavaScript before submission, with inline error messages. | M |
| FR-22 | The server shall independently validate all input with Express.js; client-side validation is never trusted. | M |
| FR-23 | Valid submissions shall be saved to the `contact_messages` table using parameterized database operations. | M |
| FR-24 | The user shall see a clear success message after a successful submission and clear error messages otherwise, with previously entered values preserved on error. | M |
| FR-25 | The form shall include spam protection: a hidden honeypot field and a per-visitor submission rate limit. | S |
| FR-26 | The form shall be protected against cross-site request forgery with a token. | M |

### 4.3 Admin dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-30 | The admin area shall be reachable only after logging in with a username and password. | M |
| FR-31 | Passwords shall be stored only as secure hashes. | M |
| FR-32 | Every admin page and action shall verify authentication on the server; unauthenticated requests shall be redirected to the login page. | M |
| FR-33 | The admin shall be able to log out; the authentication cookie shall expire after a fixed 30-minute period. | M |
| FR-34 | A dashboard home shall show a project count and shortcuts to project management and the public site. | S |
| FR-35 | The admin shall be able to create, view, edit and delete projects, with server-side validation. | M |
| FR-36 | Skills shall be retrieved dynamically from Supabase. Admin CRUD is optional. | M |
| FR-37 | Education entries shall be retrieved dynamically from Supabase. Admin CRUD is optional. | M |
| FR-38 | Valid contact messages shall be saved in Supabase. A simple admin inbox is a Should-have enhancement. | S |
| FR-39 | Delete actions shall require explicit confirmation and be performed with POST plus a CSRF token. | M |
| FR-40 | Projects shall support a published/draft state so unfinished work is not shown publicly. | S |
| FR-41 | The admin may manage project categories if time remains; otherwise categories are seeded in the database. | C |
| FR-42 | The admin shall be able to set a display order for skills, education and projects. | C |
| FR-43 | The admin shall be able to edit the profile (name, headline, bio, links). Until built, the profile is edited directly in the database. | C |
| FR-44 | The admin shall be able to change their password. | C |

---

## 5. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Responsiveness | Layout must work from 320 px to 1920 px wide using Bootstrap's grid. Tested at 320, 375, 768, 1024 and 1440 px. No horizontal scrolling at any tested width. |
| NFR-02 | Performance | Typical page loads in under 3 seconds on a normal broadband/4G connection (excluding a possible first-request serverless cold start). Images optimised and lazy-loaded below the fold. |
| NFR-03 | Security | Use Supabase query methods without concatenating user input into SQL; escape dynamic content; hash passwords; protect state-changing requests against CSRF; use secure authentication cookies; keep secrets out of the repository. Detail in TRD Sections 8, 9 and 11. |
| NFR-04 | Accessibility | Semantic HTML, a single `h1` per page, logical heading order, labels bound to inputs, alt text for images, visible keyboard focus, sufficient colour contrast in both themes. Target WCAG 2.1 AA for the main flows. |
| NFR-05 | Usability | Consistent navigation, clear calls to action, plain-language error messages, confirmation before destructive actions. |
| NFR-06 | Browser support | Current versions of Chrome, Edge, Firefox and Safari (desktop and mobile). |
| NFR-07 | Maintainability | Simple, documented folder structure; reusable page components/partials; database logic in dedicated service functions; no unnecessary frameworks. |
| NFR-08 | Portability | Runs locally on Node.js local development server and deploys to Vercel with only environment-variable changes. |
| NFR-09 | Reliability | Database errors are caught and logged server-side; users see a friendly message, never a stack trace or credentials. |
| NFR-10 | Data integrity | Database constraints (NOT NULL, UNIQUE, CHECK, foreign keys) enforce rules independently of application code. |
| NFR-11 | Privacy | Collect only what the contact form needs; no third-party trackers; visitor IPs are not stored in plain form. |
| NFR-12 | SEO basics | Unique title and meta description per page, semantic markup, Open Graph tags for sharing. |
| NFR-13 | Documentation | README with setup, database import, environment variables, admin login procedure and deployment steps; technical report. |
| NFR-14 | Originality | All content, branding and design are the owner's own; no unmodified copied templates. |

---

## 6. Website Page Structure

### 6.1 Sitemap

```
Public site
├── Home / About            /
├── Skills & Education      /skills-education
├── Projects / Portfolio    /projects
├── Contact                 /contact
└── 404 / Error page

Admin (password protected)
├── Login                   /admin/login
├── Dashboard               /admin
├── Projects                /admin/projects        (list, add, edit, delete)
├── Categories              (seeded in the database; optional admin management)
├── Skills                  (read dynamically; optional admin management)
├── Education               (read dynamically; optional admin management)
├── Messages                (stored in the database; optional admin inbox)
└── Logout                  /admin/logout
```

### 6.2 Navigation

- **Primary navbar (public):** Home, Skills & Education, Projects, Contact, plus a theme toggle.
- **Footer (public):** short tagline, social links, copyright, discreet "Admin" link.
- **Admin navigation (required):** Dashboard, Projects, View public site, Logout. Optional modules may be added only after the required features are complete.

### 6.3 Content ownership

| Content | Source | Managed by |
|---|---|---|
| Profile (name, headline, bio, links) | `site_profile` table | Database (admin edit is a Could-have) |
| Projects | `projects` | Admin dashboard (required CRUD) |
| Categories | `categories` | Seeded/maintained in the database; optional admin management |
| Skills | `skills` | Read dynamically; database updates are sufficient |
| Education | `education` | Read dynamically; database updates are sufficient |
| Contact messages | `contact_messages` | Created by visitors; optional admin inbox |

---

## 7. Detailed Features of Every Page

All personal content below is a **placeholder** to be replaced with the owner's real information.

### 7.1 Home / About (`/`)

**Purpose:** Make a strong first impression and summarise who the owner is.

| Section | Details |
|---|---|
| Navbar | Logo/name `[Brand Name]`, links, theme toggle |
| Hero | `[Full Name]`, `[Professional Headline]`, short tagline `[Tagline]`, profile photo `[Photo]`, buttons "View Projects" and "Contact Me" |
| About summary | `[Short biography]`, location `[Location]`, link to download resume `[Resume URL]` (optional) |
| Highlights | Three to four short facts `[Highlights]`; experience total computed from a stored start date (FR-14) |
| Featured projects | Up to three projects flagged as featured, read from the database, shown as cards with a "View all projects" link |
| Call to action | Short invitation to get in touch, linking to the Contact page |
| Footer | Social links, copyright, admin link |

**Dynamic data:** `site_profile` (profile text and links), `projects` where featured and published.
**JavaScript:** theme toggle, experience calculation, subtle scroll reveal (optional).

### 7.2 Skills & Education (`/skills-education`)

**Purpose:** Show capability and academic background.

| Section | Details |
|---|---|
| Page heading | Title and intro sentence |
| Skills | Grouped by category (for example Frontend, Backend, Database, Tools; category names are the owner's choice). Each skill shows name, optional icon, proficiency bar and calculated experience duration. |
| Education timeline | Each entry shows institution, degree, field of study, start and end dates (or "Present"), optional grade and description, newest first. |
| Empty states | Friendly message if no skills or education exist yet |

**Dynamic data:** `skills`, `education`.
**JavaScript:** animated proficiency bars on scroll (FR-13), experience duration from `started_on` (FR-14).
**Accessibility note:** progress bars use proper `role="progressbar"` and ARIA values so the information is not conveyed by animation alone.

### 7.3 Projects / Portfolio (`/projects`)

**Purpose:** Showcase the owner's work and let visitors explore it.

| Section | Details |
|---|---|
| Controls | Search box (live), category filter buttons, technology filter, result count, "clear filters" |
| Project grid | Responsive Bootstrap cards: image, title, summary, category badge, technology tags, hover effect |
| Details modal | Full description, technologies, project date, "Live demo" and "Source code" links (shown only when present) |
| Empty states | "No projects yet" when the table is empty; "No projects match your search" when filters return nothing |

**Dynamic data:** `projects` (published only) joined with `categories`.
**JavaScript:** combined live search and filtering over the rendered cards (FR-07, FR-08), details modal population.
**Behaviour note:** the browser requests published projects from the Express.js API and JavaScript renders the cards. If JavaScript is disabled, the static page shell remains available, but database-driven project cards and filters will not load.

### 7.4 Contact (`/contact`)

**Purpose:** Let visitors reach the owner, with reliable validation and storage.

| Section | Details |
|---|---|
| Intro | Short text plus public contact details `[Public Email]`, `[Location]`, social links |
| Form | Name, email, subject, message, character counter, submit button |
| Feedback | Inline field errors, a summary alert, and a success alert after saving |
| Protection | Honeypot field, CSRF token, rate limiting |

See Section 9 for full form behaviour.

### 7.5 Error pages

- **404 Not Found:** friendly message with links back to Home and Projects.
- **Generic error:** neutral message, no technical details or stack traces.

---

## 8. Admin Dashboard Requirements

### 8.1 Access and authentication

| Requirement | Detail |
|---|---|
| Login | Username and password form at `/admin/login` |
| Credentials | A single admin account created by a setup script; initial credentials submitted privately to the instructor, never committed to GitHub |
| Failure handling | Generic error message ("Invalid username or password"); temporary lockout after repeated failures |
| Authentication cookie | Signed JWT with a fixed 30-minute lifetime in an HttpOnly, Secure (production), SameSite=Lax cookie; cleared on logout |
| Protection | Every admin route checks the session on the server; direct URL access without login redirects to the login page |

### 8.2 Modules

**Dashboard**
- Counts: total projects and published/draft projects.
- Shortcuts: add project and view public site.

**Projects (full CRUD, Must)**

| Operation | Behaviour |
|---|---|
| List | Table with title, category, status, featured flag, date, and Edit/Delete actions; search box |
| Create | Form: title, summary, description, category, technologies (comma-separated), image URL, live URL, repository URL, project date, featured, published |
| Edit | Same form, pre-filled |
| Delete | Confirmation dialog, then POST with CSRF token; success message afterwards |
| Validation | Required fields, length limits, valid URLs (http/https only), valid date; errors shown beside fields and values preserved |

**Optional modules (only after all Must requirements pass):** category management, skills CRUD, education CRUD and a message inbox. If implemented, these modules must use the same server-side authentication, validation, CSRF protection and output escaping as project management. The skills and education pages must work without these admin modules because their content can be maintained directly in Supabase.

### 8.3 Admin UX requirements

- Consistent layout with a sidebar or top navigation.
- Flash messages for every create, update, delete and error.
- Confirmation before any deletion.
- Pagination or a sensible limit on the project list. Optional inbox pagination applies only if that module is implemented.
- Responsive: usable on tablet and phone.

---

## 9. Contact Form Functionality

### 9.1 Fields and validation rules

| Field | Required | Rules (client and server) |
|---|---|---|
| Name | Yes | Trimmed; 2 to 100 characters; letters, spaces, apostrophes, hyphens, full stops |
| Email | Yes | Trimmed; valid email format; maximum 254 characters |
| Subject | Yes | Trimmed; 3 to 150 characters |
| Message | Yes | Trimmed; 10 to 2000 characters |
| Honeypot (hidden) | Must be empty | If filled, the submission is silently discarded |
| CSRF token | Yes | Sent in the `X-CSRF-Token` request header; must match the signed CSRF cookie issued by the server |

### 9.2 Processing flow

1. Visitor fills in the form. JavaScript validates on blur and on submit, showing inline messages and blocking submission if invalid.
2. The browser POSTs the form to the server.
3. Express.js verifies the signed double-submit CSRF token (request header must match the CSRF cookie), checks the honeypot and applies the rate limit.
4. Express.js re-validates every field independently of the browser.
5. If invalid, the API returns field-level errors and no record is saved.
6. If valid, Express.js inserts the message through the Supabase client.
7. The frontend displays a success message and clears the form; repeated submissions are guarded against accidental duplicate requests.
8. The message is stored in Supabase. An admin inbox is an optional enhancement.

### 9.3 Feedback states

| State | What the visitor sees |
|---|---|
| Success | Green alert: "Thank you, your message has been sent." Form cleared. |
| Validation error | Red inline messages under the fields and a summary alert. Values preserved. |
| Rate limited | Neutral alert asking the visitor to try again later |
| Server/database error | Friendly generic message; details logged server-side only |

### 9.4 Out of scope for the contact form

Sending email notifications to the owner and providing an admin inbox are out of scope for the required implementation. Valid messages are stored in Supabase and can be inspected through the Supabase dashboard. An admin inbox may be added later as an optional enhancement.

---

## 10. User Journeys

### Journey 1: Recruiter evaluates the owner

1. Opens the Home page and reads the headline and about summary.
2. Clicks "View Projects" and sees the project grid.
3. Filters by a technology and opens a project's details modal.
4. Visits Skills & Education to confirm background.
5. Opens Contact, fills in the form, and sees a success message.

**Success:** the recruiter reaches the owner with a stored message in under three minutes.

### Journey 2: Evaluator tests the requirements

1. Navigates all four pages and resizes the browser or uses a phone to check responsiveness.
2. Submits the contact form with invalid data (empty fields, bad email) and sees JavaScript errors.
3. Disables JavaScript or tampers with the request and sees Express.js validation errors.
4. Opens `/admin` without logging in and is redirected to login.
5. During the demo, watches the owner log in, add a project, see it appear publicly, edit it, and delete it.
6. Checks the database for the stored message and records.

**Success:** every requirement is demonstrably met.

### Journey 3: Owner adds a new project

1. Goes to `/admin/login` and logs in.
2. Opens Projects and selects "Add project".
3. Fills in the form; an invalid URL triggers a clear error; corrects it and saves.
4. Sees a success message and the project in the list.
5. Opens the public Projects page and sees the new card without any code change.

### Journey 4: Owner updates portfolio content

1. Logs in and opens Projects.
2. Adds or edits a project and saves it.
3. Confirms the updated project appears on the public Projects page.

### Journey 5: Unauthorized access attempt

1. A visitor types `/admin/projects` directly, or replays a delete request without a session.
2. The server redirects to the login page (or returns 403 for state-changing requests); nothing is changed.

### Journey 6: Visitor customises the experience

1. Toggles dark mode; the choice persists after navigating and reloading.
2. Searches "[keyword]" on the Projects page and sees the grid narrow instantly.

---

## 11. Acceptance Criteria

Each criterion is written to be directly testable. IDs are referenced by the test plan.

### 11.1 Structure and navigation

- **AC-01** Given any public page, when it loads, then a navbar linking to all four pages and a footer are present and the current page is highlighted.
- **AC-02** Given a screen narrower than 992 px, when the page loads, then the navbar collapses into a toggle and opens/closes correctly.
- **AC-03** Given each page, then it has valid semantic structure: one `h1`, ordered headings, landmark elements (`header`, `nav`, `main`, `footer`), and images with alt text.

### 11.2 Responsive UI

- **AC-04** Given widths of 320, 375, 768, 1024 and 1440 px, then no horizontal scrolling occurs and content remains readable and usable.
- **AC-05** Given cards, buttons and links, when hovered or focused, then visible hover/focus states appear.

### 11.3 Dynamic content

- **AC-06** Given records in the `projects`, `skills` and `education` tables, when the pages load, then all published records appear and no project, skill or education content is hard-coded in the page source.
- **AC-07** Given a new record added through the admin dashboard, when the public page is refreshed, then it appears without editing any file.
- **AC-08** Given an empty table, when the page loads, then a friendly empty-state message appears and no error occurs.
- **AC-09** Given a draft (unpublished) project, then it does not appear on public pages.

### 11.4 Admin and CRUD

- **AC-10** Given no active session, when any `/admin` URL (other than login) is requested, then the user is redirected to the login page and no admin content is shown.
- **AC-11** Given valid credentials, when logging in, then the dashboard opens; given invalid credentials, then a generic error appears and no session is created.
- **AC-12** Given the admin is logged in, when a project is created with valid data, then it is saved and a success message is shown.
- **AC-13** Given an existing project, when edited and saved, then the changes persist and appear publicly.
- **AC-14** Given an existing project, when deleted and confirmed, then it is removed from the database and the public site; when the confirmation is cancelled, then nothing changes.
- **AC-15** Given invalid project data (empty title, invalid URL, over-length text), when submitted, then it is rejected with clear errors and nothing is saved.
- **AC-16** Given a POST request to a create, edit or delete action without a valid CSRF token or session, then it is rejected and no data changes.
- **AC-17** Given an admin authentication cookie older than 30 minutes, when a protected request is made, then the request is rejected and the admin must log in again.
- **AC-18** Skills and education records are retrieved dynamically from Supabase; editing them directly in the database is sufficient for the assignment. Optional admin CRUD may be added only if time remains.
- **AC-19** If optional admin modules are implemented, their routes must require admin authentication, validate input, protect state-changing requests against CSRF, and escape dynamic output.

### 11.5 Contact form

- **AC-20** Given invalid input (empty field, bad email, too-short message), when submitting, then JavaScript shows inline errors and does not submit.
- **AC-21** Given JavaScript disabled or a tampered request with invalid data, when submitted, then the Express.js backend rejects it and saves nothing.
- **AC-22** Given valid input, when submitted, then exactly one row is saved in `contact_messages` and a success message is shown; refreshing the page does not create a duplicate.
- **AC-23** Given the honeypot field is filled or the rate limit is exceeded, then no message is saved.

### 11.6 JavaScript interactions

- **AC-24** Typing in the project search box filters visible cards live; clearing it restores them.
- **AC-25** Selecting a category or technology filter shows only matching projects; combining search and filters works together.
- **AC-26** The theme toggle switches between light and dark and the choice persists across pages and reloads.
- **AC-27** Skill bars animate when they enter the viewport, and their numeric values are also exposed in text for accessibility.
- **AC-28** Experience durations are calculated from stored dates and update correctly as time passes.

### 11.7 Express.js and database

- **AC-29** The code uses JavaScript variables, conditions, loops, functions and Supabase database connectivity (verified by code review).
- **AC-30** User-controlled values are validated and passed as values to Supabase client operations; no user input is concatenated into raw SQL (verified by code review).
- **AC-31** Database content is escaped before being printed; submitting `<script>alert(1)</script>` in any field displays as inert text.
- **AC-32** SQL injection strings such as `' OR '1'='1` entered in the login form and forms do not bypass authentication or alter queries.

### 11.8 Security and secrets

- **AC-33** No passwords, keys or connection strings exist in the repository; they are supplied through environment variables.
- **AC-34** Row Level Security is enabled on exposed tables: public access is limited to approved portfolio reads, while admin users and contact messages cannot be read through the public API.
- **AC-35** Passwords are stored only as hashes.

### 11.9 Testing, deployment and deliverables

- **AC-36** A test report with screenshots exists for navigation, responsiveness, CRUD, validation, database updates, invalid input and unauthorized admin access.
- **AC-37** The site runs locally following the README instructions, and is deployed on Vercel with a working public URL.
- **AC-38** The deliverables exist: source code, `.sql` script (schema and sample records), user documentation, demo readiness and technical report.

---

## 12. Project Scope and Limitations

### 12.1 In scope

- Four public pages and the admin dashboard described above
- Supabase PostgreSQL database with the schema in the TRD
- Express.js API backend with `@supabase/supabase-js`
- Bootstrap 5.3 responsive design with custom branding
- Five JavaScript interactions plus contact form validation
- Single admin account with secure authentication
- Git/GitHub version control and Vercel deployment
- Test plan and evidence, user documentation, technical report

### 12.2 Out of scope

- Multiple admin users, roles or self-registration
- Blog, comments, or user accounts for visitors
- File upload and image storage (project images are referenced by URL)
- Email notifications or auto-replies from the contact form
- Multilingual support
- Payment, e-commerce or analytics integrations
- Frontend frameworks such as React, Vue or Angular; backend frameworks other than Express.js
- Native mobile apps
- Admin edit screen for the profile (Could-have, otherwise edited in the database)

### 12.3 Assumptions

- The owner supplies all personal content (Section 13); none is invented by the development process.
- A free Supabase project and a free Vercel account are available.
- Evaluators accept a cloud database and Vercel hosting; the assignment allows any relational DBMS, and the instructor has approved Express.js as the backend alternative.
- Content volume is small (tens of records), so no heavy performance engineering is required.

### 12.4 Constraints and limitations

| ID | Limitation | Impact |
|---|---|---|
| LIM-01 | **Fixed submission deadline of 14-11-2026** | Scope is deliberately lean; Could-have items are dropped first |
| LIM-02 | Vercel runs Express.js using its Node.js function/serverless model | The app must be stateless and API routing must be verified in a preview deployment |
| LIM-03 | **Vercel function instances are not durable storage** | No local file uploads or in-memory session dependency; store persistent data in Supabase and static assets in the repository |
| LIM-04 | **Supabase is cloud-hosted** | Internet is required for the demo; free projects may pause after inactivity and must be woken before the demo |
| LIM-05 | Supabase project URL and API keys must be configured correctly | Use the Supabase JS client over the project API; no direct PostgreSQL connection is required for the planned implementation |
| LIM-06 | **The Supabase service-role key bypasses RLS** | Keep it server-only; enforce admin authorization in Express.js and use RLS for public/anon access (see TRD) |
| LIM-07 | Free hosting tiers have usage limits and are for non-commercial use | Acceptable for an academic portfolio |
| LIM-08 | Project images are URLs, not uploads | Images must be hosted elsewhere or placed in the repository's static assets |

### 12.5 Risks (summary)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Express.js deployment or Supabase connectivity is misconfigured | Medium | High | Deploy a minimal Express endpoint early; verify API routing and Supabase connectivity in a Vercel preview |
| Short timeline | High | High | Strict MoSCoW priorities; reuse shared admin templates |
| Supabase project paused before demo | Medium | Medium | Open the project and run a query the day before; keep a local fallback |
| Security mistake in admin | Medium | High | Central auth guard, shared CSRF/escape helpers, security test cases |

---

## 13. Content Placeholders and Information Still Needed

Nothing personal is invented. The following items must be supplied by the owner, and placeholders are used until then.

| Item | Placeholder | Used on |
|---|---|---|
| Full name | `[Full Name]` | All pages, footer |
| Brand/logo text | `[Brand Name]` | Navbar |
| Professional headline and tagline | `[Professional Headline]`, `[Tagline]` | Home |
| Profile photo | `[Photo URL]` | Home |
| Short and long biography | `[Short Bio]`, `[Long Bio]` | Home |
| Location | `[Location]` | Home, Contact |
| Public email | `[Public Email]` | Contact, footer |
| Social links (GitHub, LinkedIn, and so on) | `[GitHub URL]`, `[LinkedIn URL]` | Footer, Contact |
| Resume link (optional) | `[Resume URL]` | Home |
| Skills (name, category, proficiency, start date) | `[Skill n]` | Skills & Education |
| Education entries | `[Institution]`, `[Degree]`, dates | Skills & Education |
| Projects (title, summary, description, category, technologies, images, links, date) | `[Project n]` | Projects, Home |
| Colour palette, typography, tone (design decisions) | To be decided in Phase 2 | All pages |
| Experience start date for the "total experience" figure | `[Start Date]` | Home |

Sample records in the exported `.sql` file will use clearly marked placeholder values until real content replaces them.

---

## 14. Milestones Summary

The five-phase plan is mandatory. Full objectives, tasks, deliverables, dependencies and checklists are in `TRD.md`, Section 18.

| Phase | Name | Indicative timing |
|---|---|---|
| 1 | Planning and Documentation | 11-11-2026 (PRD and TRD, awaiting approval) |
| 2 | UI/UX Design | 11 to 12-11-2026 |
| 3 | Backend and Database | 12 to 13-11-2026 (starts with the Express.js/Vercel/Supabase integration check) |
| 4 | Frontend Development and Integration | 13-11-2026 |
| 5 | Testing, Deployment and Final Documentation | 13 to 14-11-2026 |

The schedule is tight. If time runs short, optional dashboard modules and visual enhancements are dropped first; the four public pages, database-driven content, project CRUD, contact form and security remain priorities.

---

## 15. Traceability to University Requirements

| # | University requirement | PRD requirements | Acceptance criteria |
|---|---|---|---|
| 1 | 3 to 4 interconnected pages, semantic HTML, consistent navigation | FR-01, FR-02, FR-15, FR-16 | AC-01, AC-02, AC-03 |
| 2 | Responsive Bootstrap UI with navbar, cards, grid, hover effects, accessible forms | FR-02, FR-06, NFR-01, NFR-04 | AC-04, AC-05 |
| 3 | Dynamic projects and skills/education from the database | FR-03 to FR-06, FR-10, FR-11 | AC-06 to AC-09 |
| 4 | Password-protected admin CRUD for projects, server-side validation, secure queries | FR-30 to FR-41 | AC-10 to AC-19 |
| 5 | Contact form with JavaScript and Express.js validation, saved to the database, clear feedback | FR-20 to FR-26 | AC-20 to AC-23 |
| 6 | At least two meaningful JavaScript interactions | FR-07, FR-08, FR-12 to FR-14, FR-21 | AC-24 to AC-28 |
| 7 | Express.js variables, conditions, loops, functions, DB connectivity, parameterized database operations, escaped output | NFR-03, NFR-07 | AC-29 to AC-32 |
| 8 | Testing and screenshots | NFR-13 | AC-36 |
| 9 | Deployment, configuration and setup instructions | NFR-08, NFR-13 | AC-37 |
| 10 | Individuality and originality | NFR-14, Section 13 | AC-38 |
| Deliverables | Source code, database script, user documentation, demo, technical report | NFR-13 | AC-38 |

### Assessment rubric alignment

| Rubric item | Where addressed |
|---|---|
| R1 Selection of platform | TRD Section 3 (stack and hosting justification with alternatives) |
| R2 Originality/contribution | PRD Section 13 and NFR-14; design decisions in Phase 2 |
| R3 Engineering knowledge | TRD Sections 6 to 13 (database design, security, authentication) |
| R4 Efficiency of the alternatives | TRD Sections 2, 3 and 19 (alternatives, trade-offs, risks) |
| R5 Evaluation of the prototype | TRD Section 16 and the Phase 5 test report |

---

*End of PRD v2.0. This revised document is ready for review; Phase 2 begins after approval.*
