# Portfolio CMS — Phase & Sprint Plan

## Phase 1 — Foundation

| Sprint         | Name           | Tasks                                                                                                    | Deliverable                             |
| -------------- | -------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Sprint 1.1** | Project Setup  | Initialize backend, TypeScript, Express, Prisma, PostgreSQL, environment configuration, folder structure | Running backend connected to PostgreSQL |
| **Sprint 1.2** | Database Setup | Create `User`, `Article`, `Project`, `Config`, and `Status` models; relationships; migrations; seed data | Database ready for development          |

---

## Phase 2 — Authentication

| Sprint         | Name             | Tasks                                                                                       | Deliverable                             |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Sprint 2.1** | Authentication   | Password hashing, login, JWT access token, refresh token, logout, authentication middleware | Secure admin authentication             |
| **Sprint 2.2** | Account Recovery | Recovery key hashing, recovery endpoint, password reset, rate limiting                      | Admin can recover account without email |

---

## Phase 3 — Project Management

| Sprint         | Name          | Tasks                                                                                   | Deliverable                                   |
| -------------- | ------------- | --------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Sprint 3.1** | Project CRUD  | Create, read, update, delete projects; validation; status management; featured projects | Projects can be managed through API           |
| **Sprint 3.2** | Project Media | Cloudinary setup, project image upload, image validation, public project API            | Projects support images and public publishing |

---

## Phase 4 — Article Management

| Sprint         | Name             | Tasks                                                                                                           | Deliverable                                   |
| -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Sprint 4.1** | Article CRUD     | Create, read, update, archive articles; slug generation; category; tech stack; excerpt; featured status         | Articles can be managed through API           |
| **Sprint 4.2** | Markdown Upload  | ZIP upload, ZIP validation, extract `article.md`, process Markdown, identify image references                   | Markdown articles can be uploaded             |
| **Sprint 4.3** | Image Processing | Upload referenced images to Cloudinary, replace local image paths with Cloudinary URLs, save processed Markdown | Complete Markdown + image publishing pipeline |

---

## Phase 5 — Admin CMS

| Sprint         | Name                  | Tasks                                                                         | Deliverable                     |
| -------------- | --------------------- | ----------------------------------------------------------------------------- | ------------------------------- |
| **Sprint 5.1** | Admin Dashboard       | Login UI, protected routes, dashboard, basic content statistics, navigation   | Functional admin dashboard      |
| **Sprint 5.2** | Project Management UI | Project list, create/edit project, image upload, publish/archive              | Projects can be managed from UI |
| **Sprint 5.3** | Article Management UI | Article list, Markdown ZIP upload, metadata editing, preview, publish/archive | Articles can be managed from UI |

---

## Phase 6 — Public Portfolio

| Sprint         | Name              | Tasks                                                                             | Deliverable                       |
| -------------- | ----------------- | --------------------------------------------------------------------------------- | --------------------------------- |
| **Sprint 6.1** | Project Portfolio | Homepage, project listing, project details, featured projects, responsive UI      | Public projects section           |
| **Sprint 6.2** | Technical Writing | Article listing, article details, Markdown rendering, syntax highlighting, images | Public technical writing section  |
| **Sprint 6.3** | SEO & Polish      | Metadata, Open Graph tags, slugs, responsive fixes, loading/error states          | Production-ready public portfolio |

---

## Phase 7 — Testing & Deployment

| Sprint         | Name                  | Tasks                                                                                                                  | Deliverable                |
| -------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Sprint 7.1** | Testing & Security    | Authentication tests, article tests, project tests, upload tests, validation, rate limiting, path traversal protection | Stable and secure MVP      |
| **Sprint 7.2** | Production Deployment | Deploy backend, database, frontend, Cloudinary configuration, domain, CORS, production migrations                      | Live portfolio CMS         |
| **Sprint 7.3** | Final QA              | Test authentication, project publishing, Markdown upload, images, public pages, mobile responsiveness                  | Verified production system |

---

# Overall Timeline

| Phase       | Sprint     | Focus                 |
| ----------- | ---------- | --------------------- |
| **Phase 1** | Sprint 1.1 | Project Setup         |
|             | Sprint 1.2 | Database              |
| **Phase 2** | Sprint 2.1 | Authentication        |
|             | Sprint 2.2 | Account Recovery      |
| **Phase 3** | Sprint 3.1 | Project CRUD          |
|             | Sprint 3.2 | Project Media         |
| **Phase 4** | Sprint 4.1 | Article CRUD          |
|             | Sprint 4.2 | Markdown Upload       |
|             | Sprint 4.3 | Image Processing      |
| **Phase 5** | Sprint 5.1 | Admin Dashboard       |
|             | Sprint 5.2 | Project Management UI |
|             | Sprint 5.3 | Article Management UI |
| **Phase 6** | Sprint 6.1 | Project Portfolio     |
|             | Sprint 6.2 | Technical Writing     |
|             | Sprint 6.3 | SEO & Polish          |
| **Phase 7** | Sprint 7.1 | Testing & Security    |
|             | Sprint 7.2 | Deployment            |
|             | Sprint 7.3 | Final QA              |

---

# MVP Boundary

The MVP ends at:

```text
Phase 7 → Sprint 7.3
```

Anything beyond that should be treated as a future improvement.

### Not part of the MVP

| Feature                   | Status     |
| ------------------------- | ---------- |
| Custom Markdown editor    | Later      |
| Rich text editor          | Later      |
| Multiple authors          | Later      |
| Roles & permissions       | Later      |
| Email password recovery   | Later      |
| Article versioning        | Later      |
| Autosave                  | Later      |
| Scheduled publishing      | Later      |
| Comments                  | Later      |
| Likes                     | Later      |
| Newsletter                | Later      |
| Analytics                 | Later      |
| Search                    | Later      |
| Media library             | Later      |
| Microservices             | Not needed |
| Event-driven architecture | Not needed |

---

# Development Principle

Each sprint should produce a **working piece of the system**.

For example:

```text
Sprint 1.1
    ↓
Backend runs

Sprint 1.2
    ↓
Database works

Sprint 2.1
    ↓
Admin can log in

Sprint 3.1
    ↓
Projects can be managed

Sprint 4.2
    ↓
Markdown can be uploaded

Sprint 4.3
    ↓
Markdown + images work

Sprint 5.x
    ↓
Admin can manage everything

Sprint 6.x
    ↓
Visitors can see everything

Sprint 7.x
    ↓
Deploy
```

> **Rule:** Don't add a new sprint just because a technology seems interesting. Add it because the product actually needs it.
